const {body} = require('express-validator');

const User = require('../models/User');

const nameValidator = body('name', 'Invalid name')
    .exists()
    .notEmpty()
    .isLength({min: 2, max: 20})
    .isAlpha('en-US', {ignore: /\s/g})

const emailValidator = body('email', 'Invalid email')
    .exists()
    .notEmpty()
    .isEmail()
    .custom(async (email, {req}) => {
        try {
            const userWithThisEmailExists = await User.findOne({email: req.body.email})
            if (userWithThisEmailExists) {
                return Promise.reject(`User with email ${email} already exists`);
            }
        } catch (err) {
            throw err
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
    .custom((password, {req}) => {
        if (password !== req.body.confirmPassword) {
            throw new Error("Passwords doesn't match")
        } else {
            return password;
        }
    })

module.exports = {
    nameValidator,
    emailValidator,
    passwordValidator,
};
