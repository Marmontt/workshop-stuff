module.exports = {
    uri: 'mongodb://localhost:27017/pandorasBox',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    secret: 'goat secret',
}
