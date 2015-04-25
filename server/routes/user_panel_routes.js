var express, router;

express = require('express');
router = express.Router();

var React         = require('react')
var path          = require("path");
var SignUp  = require('../../assets/dist/js/components/signup')
var Login  = require('../../assets/dist/js/components/login')
var Users  = require('../../assets/dist/js/components/users')
var ShowUser  = require('../../assets/dist/js/components/show_user')

router.get('/', function(req, res, next) {
  if(req.authenticated){
    res.redirect('/users');
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
  if(!req.authenticated){
    return res.redirect('/login');
  }
  // var factory = React.createFactory(Users);
  var markup = "";
  return res.render('index', {
    title: 'Users',
    markup: markup,
    authenticated:  req.authenticated
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