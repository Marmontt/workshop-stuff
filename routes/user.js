const express = require('express');

const {
    updateDateOfBirthValidator,
    updateEmailValidator,
    updateNameValidator
} = require('../validators/updateProfile');
const {updateUser, uploadAvatar} = require('../controllers/user');
const checkAuth = require('../middlewares/checkAuth');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

router.patch(
    '/:id',
    checkAuth,
    updateEmailValidator,
    updateNameValidator,
    updateDateOfBirthValidator,
    updateUser
)

router.post('/:id/uploadAvatar', checkAuth, upload, uploadAvatar)

module.exports = router;
