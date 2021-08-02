const {body} = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

const emailValidator = body('email', 'Invalid email')
    .exists()
    .notEmpty()
    .isEmail()
    .custom(async (email, {req}) => {
        try {
            const userWithThisEmailExists = await User.findOne({email: req.body.email})
            if (!userWithThisEmailExists) {
                return new Error(`Wrong credentials combination`);
            }
        } catch (err) {
            new Error(err);
        }
        return email
    })
    .withMessage({
        message: `User with provided email already exists`
    })

const passwordValidator = body('password', 'Invalid password')
    .exists()
    .notEmpty()
    .isLength({min: 6, max: 12})
    .custom(async (password, {req}) => {
        try {
            const query = {email: req.body.email};
            const user = await User.findOne(query);
            if (!user) {
                return new Error('Wrong credentials combination');
            }
            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return new Error('Wrong password');
            }
            return password;
        } catch (err) {
            throw new Error(err);
        }
    })

module.exports = {
    emailValidator,
    passwordValidator,
};
