generator = require('creditcard-generator');

const User = require('../models/User');

const generateCC = async () => {
    let cc = generator.GenCC("Mastercard").join('');
    do {
        cc = generator.GenCC("Mastercard").join('');
    } while (await User.findOne({accountNumber: cc}))
    return cc;
};

module.exports = generateCC;
