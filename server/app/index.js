'use strict'; 

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');

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

app.post('/login', function (req, res, next) {
    User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    .exec()
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
        	console.log('In login route');
            req.session.userId = user._id;
            res.sendStatus(200);
        }
    })
    .then(null, next);
});

app.post('/signup', function (req, res, next) {
    User.create({
        email: req.body.email,
        password: req.body.password
    })
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
        	console.log('In signup route');
            req.session.userId = user._id;
            res.sendStatus(200);
        }
    })
    .then(null, next);
});

app.get('/logout', function (req, res, next) {
    User.findById(req.session.userId)
    .exec()
    .then(function (user) {
        if (!user) {
            res.sendStatus(401);
        } else {
        	console.log('In logout route');
            req.session.userId = null;
            res.sendStatus(200);
        }
    })
    .then(null, next);
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