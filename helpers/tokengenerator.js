const jwt = require('jsonwebtoken');
const {secret} = require('../configs/database');

const tokenGenerator = (id) => {
    const payload = {id};

    return jwt.sign(payload, secret, {expiresIn: '1h'});
};

module.exports = tokenGenerator;
