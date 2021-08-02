const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')

const User = require('../models/User');
const generateCC = require('../helpers/ccgenerator')
const tokenGenerator = require('../helpers/tokengenerator');
// const TransactionStatus = require('../models/TransactionStatus');

const registration = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Validation error', errors: errors.array()})
        }
        // const CREATED = new TransactionStatus()
        // const IN_REVIEW = new TransactionStatus({value: 'IN_REVIEW'})
        // const DECLINED = new TransactionStatus({value: 'DECLINED'})
        // const CANCELED = new TransactionStatus({value: 'CANCELED'})
        // const COMPLETE = new TransactionStatus({value: 'COMPLETE'})
        //
        // await CREATED.save()
        // await IN_REVIEW.save()
        // await DECLINED.save()
        // await CANCELED.save()
        // await COMPLETE.save()
        const {name, email, password} = req.body;
        const hashPassword = bcrypt.hashSync(password, 10);
        const uniqueCC = await generateCC();
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            accountNumber: uniqueCC,
        });
        await newUser.save();
        res.status(201).json({message: 'User successfully created'})
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Registration failed'})
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({message: 'Validation error', errors: errors.array()})
        }
        const {email} = req.body;
        const query = {email}
        const user = await User.findOne(query)
        if (!user) {
            return res.status(400).json({message: 'Wrong credentials combination'})
        }
        const token = tokenGenerator(user._id)
        return res.status(200).json({id: user._id, token})
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Login failed'})
    }
};

module.exports = {
    registration,
    login,
};
