const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Task');
const Task = mongoose.model('tasks');

router.get('/', ensureAuthenticated, (req, res) => {
    Task.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then((tasks) => {
            res.render('tasks/index', {
                tasks
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('tasks/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Task
        .findOne({
            _id: req.params.id
        })
        .then((task) => {
            if (task.user !== req.user.id) {
                req.flash('error_msg', 'Not authorized');
                res.redirect('/tasks');
            }

            res.render('tasks/edit', {
                task
            });
        });
});

router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }

    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }

    if (errors.length > 0) {
        res.render('tasks/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };

        new Task(newUser)
            .save()
            .then((task) => {
                req.flash('success_msg', 'Task added!');
                res.redirect('/tasks');
            });
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Task
        .findOne({
            _id: req.params.id
        })
        .then((task) => {
            task.title = req.body.title;
            task.details = req.body.details;

            task.save()
                .then(() => {
                    req.flash('success_msg', 'Task updated!');
                    res.redirect('/tasks');
                });
        });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Task.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Task removed!');
            res.redirect('/tasks');
        });
});

module.exports = router;
