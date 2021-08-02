const {body} = require('express-validator');

const User = require('../models/User');

const recipientValidator = body('recipient', 'Invalid recipient account number')
    .exists()
    .notEmpty()
    .isString()
    .custom(async (recipient, {req}) => {
        try {
            const filter = {accountNumber: recipient}
            const user = await User.findOne(filter);
            if (!user) {
                return new Error(`Recipient doesnt exist`);
            }
        } catch (err) {
            new Error(err);
        }
        return recipient
    })
    .withMessage({
        message: 'Wrong recipient account number'
    })

const amountValidator = body('amount', 'Invalid amount provided')
    .exists()
    .notEmpty()
    .isNumeric()
    .custom(async (amount, {req}) => {
        try {
            const {id} = req.user;
            const user = await User.findById(id);
            console.log(id, user)
            if (!user) {
                return new Error('Something went wrong');
            }
            if (amount > user.wallet.amount) {
                return new Error('Not enough money on your account')
            }
            return amount;
        } catch (err) {
            throw new Error(err);
        }
    })
    .withMessage({
        message: 'Wrong amount number'
    })

const currencyValidator = body('currency', 'Invalid currency provided')
    .exists()
    .notEmpty()
    .isString()
    .isLocale()

const descriptionValidator = body('currency', 'Invalid currency provided')
    .optional()
    .isString()


module.exports = {
    currencyValidator,
    amountValidator,
    recipientValidator,
    descriptionValidator,
};
