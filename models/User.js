const {Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
    },
    dateOfBirth: {
        type: Date
    },
    wallet: {
        amount: {
            type: Number,
            default: 100.50,
        },
        currency: {
            type: String,
            default: 'en-US'
        }
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    transactions: [{
        type: Object,
        ref: 'Transaction'
    }]
});

module.exports = model('User', UserSchema)
