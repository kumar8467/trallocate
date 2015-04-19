var express, router;

express = require('express');

router = express.Router();
var path    = require("path");

/* GET home page. */
router.post('/api/v1/signup', require('../scripts/signup').init);

//Email Activation api
router.post('/api/v1/activate', require('../scripts/signup').activate);

//Authntication Api
router.post('/api/v1/auth_user', require('../scripts/authentication').init);

router.post('/api/v1/forgot', require('../scripts/forgot').init);

router.post('/api/v1/reset', require('../scripts/reset').init);

router.get('/api/v1/users', require('../scripts/user').find);

router.post('/api/v1/users', require('../scripts/user').find);

router.get('/api/v1/users/:id', require('../scripts/user').get);

router.put('/api/v1/users/:id', require('../scripts/user').put);

router["delete"]('/api/v1/users/:id', require('../scripts/user')["delete"]);

//User Panel

module.exports = router;
