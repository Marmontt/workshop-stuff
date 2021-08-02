const express = require('express');

const {
    cancelTransfer,
    getTransfers,
    createTransfer,
    downloadTransfers,
    getTransferStatus
} = require('../controllers/transfer')
const {
    descriptionValidator,
    recipientValidator,
    amountValidator,
    currencyValidator
} = require('../validators/createTransfer')
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/', checkAuth, getTransfers);

router.get('/download', checkAuth, downloadTransfers);

router.get('/status/:transferId', checkAuth, getTransferStatus)

router.post('/create',checkAuth, recipientValidator, amountValidator, currencyValidator, descriptionValidator, createTransfer);

router.post('/cancel/:id', checkAuth, cancelTransfer);

module.exports = router;
