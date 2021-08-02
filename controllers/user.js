const {validationResult} = require('express-validator')

const User = require('../models/User');

const updateUser = async (req, res) => {
    const {id} = req.params;
    const updates = req.body;
    const {id: tokenId} = req.user;

    try {
        if (id !== tokenId) {
            return res.status(400).json({message: 'Bad request'});
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const options = {new: true, omitUndefined: true};
        const user = await User.findByIdAndUpdate(id, updates, options)
        if (!user) {
            return res.status(400).json({message: 'Bad request'})
        }
        const formattedResponse = {
            name: user.name,
            id: user._id,
            avatar: user.avatar,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            accountNumber: user.accountNumber,
        };
        res.status(200).json({message: 'User successfully updated', user: formattedResponse})
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
};

const uploadAvatar = async (req, res) => {
    const {id} = req.params;
    const {id: tokenId} = req.user;

    const updates = {avatar: req.file.path};
    try {
        if (id !== tokenId) {
            return res.status(400).json({message: 'Bad request'});
        }
        const options = {new: true, omitUndefined: true};
        const user = await User.findByIdAndUpdate(id, updates, options)
        if (!user) {
            return res.status(400).json({message: 'Something went wrong'})
        }
        res.status(200).json({message: 'Avatar was updated'})
    } catch (err) {
        console.error(err);
        res.status(500).end('Internal server error');
    }
};


module.exports = {
    updateUser,
    uploadAvatar,
};
