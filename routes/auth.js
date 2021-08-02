const express = require('express');

const {registration, login} = require('../controllers/auth');
const registerValidations = require('../validators/register');
const loginValidations = require('../validators/login');

const router = express.Router();

router.post(
    '/register',
    registerValidations.emailValidator,
    registerValidations.nameValidator,
    registerValidations.passwordValidator,
    registration
);

router.post(
    '/login',
    loginValidations.emailValidator,
    loginValidations.passwordValidator,
    login
);

module.exports = router;
