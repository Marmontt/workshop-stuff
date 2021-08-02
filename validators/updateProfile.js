const {body} = require('express-validator');

const User = require('../models/User');

const updateNameValidator = body('name', 'Invalid name')
    .optional()
    .isLength({min: 2, max: 20})
    .isAlpha('en-US', {ignore: /\s/g})

const updateEmailValidator = body('email', 'Invalid email')
    .optional()
    .isEmail()
    .custom(async (email, {req}) => {
        try {
            const query = {email: req.body.email};
            const userWithThisEmailExists = await User.findOne(query);
            if (userWithThisEmailExists) {
                return;
            }
        } catch (err) {
            throw new Error(err);
        }
        return email;
    })
    .withMessage({
        message: `User with provided email already exists`
    })

const updateDateOfBirthValidator = body('dateOfBirth', 'Invalid date')
    .optional()
    .isDate()

module.exports = {
    updateNameValidator,
    updateEmailValidator,
    updateDateOfBirthValidator,
};
