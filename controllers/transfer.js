const {validationResult} = require('express-validator');

const TransactionStatus = require('../models/TransactionStatus');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const createArchive = require('../helpers/createArchive');

const mockTransaction = async (body, id, errors) => {
    const {recipient, amount, currency, description} = body;

    const {accountNumber} = await User.findById(id).select('accountNumber')
    const {value: createdStatus} = await TransactionStatus.findOne({value: "CREATED"})

    const newTransaction = new Transaction({
        senderAccountNumber: accountNumber,
        receiverAccountNumber: recipient,
        description,
        amount,
        currency,
        status: createdStatus,
        creationDate: new Date().toISOString()
    })

    await newTransaction.save()

    await User.findByIdAndUpdate(id, {
        $push: {
            transactions: newTransaction,
        },
    })

    const {value: inReviewStatus} = await TransactionStatus.findOne({value: "IN_REVIEW"})
    await User.updateOne({
        _id: id,
        'transactions._id': newTransaction._id
    }, {$set: {'transactions.$.status': inReviewStatus}})


    setTimeout(async () => {
        const {transactions} = await User.findOne({
            _id: id,
            'transactions._id': newTransaction._id
        }, {'transactions.status': 1})
        if (transactions[0].status === 'IN_REVIEW') {
            if (!errors.isEmpty()) {
                console.log(errors.errors[0].msg)
                const {value: declinedStatus} = await TransactionStatus.findOne({value: "DECLINED"})
                await User.updateOne({
                    _id: id,
                    'transactions._id': newTransaction._id
                }, {$set: {'transactions.$.status': declinedStatus}})
                await Transaction.findByIdAndUpdate(newTransaction._id, {status: declinedStatus})
            } else {
                const {value: completeStatus} = await TransactionStatus.findOne({value: "COMPLETE"})
                await User.findOne({accountNumber: recipient}, (err, doc) => {
                    if (err) {
                        throw err
                    }
                    doc.wallet.amount += amount;
                    doc.save();
                })
                await User.findOne({accountNumber: accountNumber}, (err, doc) => {
                    if (err) {
                        throw err
                    }
                    doc.wallet.amount -= amount;
                    doc.save();
                })
                await User.updateOne({
                    _id: id,
                    'transactions._id': newTransaction._id
                }, {$set: {'transactions.$.status': completeStatus}})

                await User.findOneAndUpdate({accountNumber: recipient}, {
                    $push: {
                        transactions: newTransaction,
                    },
                })
                await User.updateOne({
                    accountNumber: recipient,
                    'transactions._id': newTransaction._id
                }, {$set: {'transactions.$.status': completeStatus}})
                await Transaction.findByIdAndUpdate(newTransaction._id, {status: completeStatus})
            }

        }
    }, 1000 * 60) // 1 minute
}

const createTransfer = async (req, res) => {
    const {id} = req.user;

    try {
        const errors = validationResult(req);


        await mockTransaction(req.body, id, errors)
        res.status(200).json({message: 'Success'})
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
}

const cancelTransfer = async (req, res) => {
    const {id} = req.params;

    try {
        const {value: canceledStatus} = await TransactionStatus.findOne({value: "CANCELED"})
        await User.updateOne({
            'transactions._id': id
        }, {$set: {'transactions.$.status': canceledStatus}})
        await Transaction.findByIdAndUpdate(id, {status: canceledStatus})
        return res.status(200).json({message: 'Transaction was canceled successfully'})
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
}

const getTransfers = async (req, res) => {
    const {id} = req.user;

    try {
        const transactions = await User.findById(id, 'transactions -_id', {sort: {creationDate: 'desc'}})
        res.status(200).json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
}

const getTransferStatus = async (req, res) => {
    const {id} = req.user;
    const {transferId} = req.params;

    try {
        const transfer = await User.findById(id).select('transactions').find({_id: transferId});
        if (!transfer) {
            return res.status(500).json({message: 'Something went wrong'})
        }
        res.status(200).json(transfer)
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
}

const downloadTransfers = async (req, res) => {
    const {id} = req.user;

    try {
        const {transactions} = await User.findById(id).select('transactions');
        // if (transactions.length === 0) {
        //     return res.status(200).json({message: 'No transactions to download'})
        // }
        await createArchive(transactions).then(() => {
            return res.download('./csv/data.zip')
        });
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
}

module.exports = {
    createTransfer,
    getTransfers,
    cancelTransfer,
    downloadTransfers,
    getTransferStatus,
};
