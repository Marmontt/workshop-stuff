const {Schema, model} = require('mongoose');

const TransactionSchema = Schema({
    senderAccountNumber: {
        type: String,
        required: true,
    },
    receiverAccountNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: 'en-US'
    },
    creationDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        ref: 'TransactionStatus',
        default: 'CREATED',
    }
});

module.exports = model('Transaction', TransactionSchema)
