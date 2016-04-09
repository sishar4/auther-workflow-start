'use strict'; 

var app = require('express')();
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
  new GoogleStrategy({
    clientID: '730744602815-osc71tvq1kg7vs2o9a4kdajkdu17dvae.apps.googleusercontent.com',
    clientSecret: require('../../secrets').google,
    callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
  },
  // Google will send back the token and profile
  function (token, refreshToken, profile, done) {
    // the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
    console.log('---', 'in verification callback', profile, '---');
    mongoose.model('User').findOne({
        google: {id: profile.id}
    })
    .exec()
    .then(function (user) {
        if (user) return user;
        
        return mongoose.model('User').create({
            email: profile.emails[0].value,
            google: {
                id: profile.id,
                token: token,
                name: profile.givenName,
                email: profile.emails[0].value
            }
        });
    })
    .then(function (user) {
        //user definitely exists
        done(null, user);
    }, done);
}));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    mongoose.model('User').findById(id)
    .exec()
    .then(function (user) {
        done(null, user);
    }, done);
});
app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

// app.use(require('./sessions.middleware'));
app.use(session({
	secret: 'sahilisthebest'
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    console.log('user', req.user);
    next();
});
// Google authentication and login 
app.get('/auth/google', passport.authenticate('google', { 
    scope : 'email' 
}));
// handle the callback after Google has authenticated the user
app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/', // or wherever
    failureRedirect : '/' // or wherever
}));

app.use(require('./statics.middleware'));

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
            req.login(user, function (err) {
                if (err) next(err);
                else res.json(user);
            });
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
            req.login(user, function (err) {
                if (err) next(err);
                else res.status(201).json(user);
            });
        }
    })
    .then(null, next);
});

app.delete('/logout', function (req, res, next) {
    req.logout();
    res.sendStatus(204);
});

app.get('/me', function (req, res, next) {
    res.json(req.user);
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