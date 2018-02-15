if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'the string from mlab!'
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/task-manager'
    };
}
