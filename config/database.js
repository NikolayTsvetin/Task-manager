if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://nikolaytsvetin:Cwetin123@ds237848.mlab.com:37848/task-manager'
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/task-manager'
    };
}
