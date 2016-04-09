'use strict'; 

var app = require('express')();
var path = require('path');
var mongoose = require('mongoose');

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(require('./statics.middleware'));

// app.use(require('./sessions.middleware'));
var session = require('express-session');
app.use(session({
	secret: 'sahilisthebest'
}));
// place right after the session setup middleware
app.use(function (req, res, next) {
    console.log('session', req.session);
    next();
});

app.use('/api', function(req, res, next) {
    req.session.counter = req.session.counter || 0;
    req.session.counter++;
    next();
});

app.post('/login', function (req, res, next) {
    //find a user based on req.body
    mongoose.model('User').findOne({
        email: req.body.email,
        password: req.body.password
    })
    .exec()
    //persist user to session
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
            req.session.userId = user._id;
            res.json(user);
        }
    })
    .then(null, next);
});

app.post('/signup', function (req, res, next) {
    mongoose.model('User').create({
        email: req.body.email,
        password: req.body.password
    })
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
            req.session.userId = user._id;
            res.status(201).json(user);
        }
    })
    .then(null, next);
});

app.delete('/logout', function (req, res, next) {

    delete req.session.userId;
    res.sendStatus(204);
});

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
	app.get(stateRoute, function (req, res) {
		res.sendFile(indexPath);
	});
});

app.use(require('./error.middleware'));

app.use(function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});



module.exports = app;