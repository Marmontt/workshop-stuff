const {Schema, model} = require('mongoose');

const TransactionStatusSchema = Schema({
    value: {
        type: String,
        default: 'CREATED'
    }
});

module.exports = model('TransactionStatus', TransactionStatusSchema)
