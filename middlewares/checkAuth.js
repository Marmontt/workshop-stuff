const jwt = require('jsonwebtoken');

const {secret} = require('../configs/database');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({message: 'Unauthorized'});
    }
}
