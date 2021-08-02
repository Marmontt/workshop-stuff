const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {uri, options} = require('./configs/database');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const transfersRouter = require('./routes/transfers');

const PORT = process.env.PORT || 8080;
const corsOptions = {
    origin: `http://localhost:${PORT}`,
};

const app = express();

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('public/uploads', express.static('uploads'));
app.use(cors(corsOptions));

// DB connection
mongoose.connect(uri, options)

mongoose.connection
    .once('open', () => console.log('Connected to DB...'))
    .on('error', (error) => console.error('Connection error:', error))

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/transfers', transfersRouter);

// Default error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error'
        }
    })
})

// Listener
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
