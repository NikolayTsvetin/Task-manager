const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You logged out!');
    res.redirect('/users/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match!' });
    }

    if (req.body.password.length < 5) {
        errors.push({ text: 'Password must be at least 5 characters' });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    req.flash('error_msg',
                        'There is user with this email already');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            throw err;
                        }

                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err;
                            }

                            newUser.password = hash;
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg',
                                        'You are registered!');
                                    res.redirect('/users/login');
                                })
                                .catch((err) => {
                                    console.log(`Error in users route ${err}`);

                                    return;
                                });
                        });
                    });
                }
            });
    }
});

module.exports = router;
