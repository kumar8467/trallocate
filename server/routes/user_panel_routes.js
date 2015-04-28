'use strict'
var express, router;
express = require('express');
router = express.Router();

var React, path, SignUp, Login, Users, Dashboard, ShowUser, passport, GoogleStrategy, FacebookStrategy;
React = require('react');
path = require("path");
SignUp = require('../../assets/dist/js/components/signup/signup');
Login = require('../../assets/dist/js/components/login/login');
Users = require('../../assets/dist/js/components/admin/users');
Dashboard = require('../../assets/dist/js/components/dashboard/dashboard');
ShowUser = require('../../assets/dist/js/components/admin/show_user');
passport = require('passport');
GoogleStrategy = require('passport-google').Strategy;
FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    //create user account
    //User.findOrCreate({ openId: identifier }, function(err, user) {
    //  done(err, user);
    //});
  }
));

router.get('/auth/google', passport.authenticate('google'));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //create user account
    //User.findOrCreate(..., function(err, user) {
    //  if (err) { return done(err); }
    //  done(null, user);
    //});
  }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
    failureRedirect: '/login' }));

router.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/users',
    failureRedirect: '/login' }));

router.get('/', function (req, res, next) {
  if (req.authenticated && req.user_data) {
    return (req.user_data.admin ? res.redirect('/users') : res.redirect('/dashboard'));
  }
  return res.redirect('/login');
});

router.get('/signup', function (req, res, next) {
  console.log('******** in user panel ********');
  var factory = React.createFactory(SignUp),
    markup = React.renderToString(factory());
  return res.render('index', {
    title: 'SignUp',
    markup: markup,
    authenticated: req.authenticated
  });
});

router.get('/login', function (req, res, next) {
  console.log('******** in user panel ********');
  if (req.authenticated) {
    return res.redirect('/users');
  }
  var factory = React.createFactory(Login),
    markup = React.renderToString(factory());
  return res.render('index', {
    title: 'Login',
    markup: markup,
    authenticated: req.authenticated
  });
});

router.get('/users', function (req, res, next) {
  if (!(req.authenticated && req.user_data)) {
    return res.redirect('/login');
  } else if (req.authenticated && req.user_data && !req.user_data.admin) {
    return res.redirect('/dashboard');
  }
  // var factory = React.createFactory(Users);
  var markup = "";
  return res.render('index', {
    title: 'Users',
    markup: markup,
    authenticated: req.authenticated
  });
});

router.get('/dashboard', function (req, res, next) {
  if (!(req.authenticated && req.user_data)) {
    return res.redirect('/login');
  }
  var factory = React.createFactory(Dashboard);
  var markup = React.renderToString(factory());
  return res.render('index', {
    title: 'Dashboard',
    markup: markup,
    authenticated: req.authenticated,
    admin: false
  });
});

router.get('/users/:userId', function (req, res, next) {
  if (!req.authenticated) {
    return res.redirect('/login');
  }
  // var factory = React.createFactory(ShowUser);
  var markup = "";
  return res.render('index', {
    title: 'User',
    markup: markup,
    authenticated: req.authenticated
  });
});

router.post('/api/v1/signin', require('../scripts/authentication').init);

router.get('/api/v1/user-data', require('../scripts/authentication').user_data);

router.post('/api/v1/signup', require('../scripts/signup').init);

//Email Activation api
router.get('/activation', require('../scripts/signup').activate);

module.exports = router;