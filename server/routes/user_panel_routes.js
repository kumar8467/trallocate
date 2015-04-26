var express, router;

express = require('express');
router = express.Router();

var React         = require('react')
var path          = require("path");
var SignUp  = require('../../assets/dist/js/components/signup/signup')
var Login  = require('../../assets/dist/js/components/login/login')
var Users  = require('../../assets/dist/js/components/admin/users')
var Dasboard  = require('../../assets/dist/js/components/dashboard/dashboard')
var ShowUser  = require('../../assets/dist/js/components/admin/show_user')

router.get('/', function(req, res, next) {
  if(req.authenticated && req.user_data){
    return (req.user_data.admin ? res.redirect('/users') : res.redirect('/dashboard'))
  }else{
    res.redirect('/login');
  }
});

router.get('/signup', function(req, res, next) {
  console.log('******** in user panel ********');
  var factory = React.createFactory(SignUp);
  var markup = React.renderToString(factory());
  return res.render('index', {
    title: 'SignUp',
    markup: markup,
    authenticated:  req.authenticated
  });
});

router.get('/login', function(req, res, next) {
  console.log('******** in user panel ********');
  if(req.authenticated){
    return res.redirect('/users');
  }
  var factory = React.createFactory(Login);
  var markup = React.renderToString(factory());
  return res.render('index', {
    title: 'Login',
    markup: markup,
    authenticated:  req.authenticated
  });
});

router.get('/users', function(req, res, next) {
  if(!(req.authenticated && req.user_data)){
    return res.redirect('/login');
  }else if(req.authenticated && req.user_data && !req.user_data.admin){
    return res.redirect('/dashboard');
  }
  // var factory = React.createFactory(Users);
  var markup = "";
  return res.render('index', {
    title: 'Users',
    markup: markup,
    authenticated:  req.authenticated
  });
});

router.get('/dashboard', function(req, res, next) {
  if(!(req.authenticated && req.user_data)){
    return res.redirect('/login');
  }
  var factory = React.createFactory(Dasboard);
  var markup = React.renderToString(factory());
  return res.render('index', {
    title: 'Dashboard',
    markup: markup,
    authenticated:  req.authenticated,
    admin: false
  });
});

router.get('/users/:userId', function(req, res, next) {
  if(!req.authenticated){
    return res.redirect('/login');
  }
  // var factory = React.createFactory(ShowUser);
  var markup = "";
  return res.render('index', {
    title: 'User',
    markup: markup,
    authenticated:  req.authenticated
  });
});

// router.post('/api/v1/authenticate', require('../scripts/user_panel_authentication').init);
router.post('/api/v1/signin', require('../scripts/authentication').init);

router.get('/api/v1/user-data', require('../scripts/authentication').user_data);

router.post('/api/v1/signup', require('../scripts/signup').init);

//Email Activation api
router.get('/activation', require('../scripts/signup').activate);

module.exports = router;