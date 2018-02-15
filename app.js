const express = require('express');
const expressHandlebars = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();

const port = process.env.PORT || 3000;

const tasks = require('./routes/tasks');
const users = require('./routes/users');

require('./config/passport')(passport);

const db = require('./config/database');

mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI, {
    useMongoClient: true
})
    .then(() => {
        console.log('MongoDB connected.');
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req, res) => {
    const title = 'Welcome';

    res.render('index', {
        title
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use('/tasks', tasks);
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server running on localhost:${port}`);
});
