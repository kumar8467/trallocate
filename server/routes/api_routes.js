var express, router;

express = require('express');

router = express.Router();
var path    = require("path");
Err = require('../helpers/error_handler');

//Authntication Api
router.all("*",function(req,res,next){
    if(req.authenticated)
        next()
    else
        next(Err.status(403))
})

router.post('/forgot', require('../scripts/forgot').init);

router.post('/reset', require('../scripts/reset').init);

router.get('/users', require('../scripts/user').find);

router.post('/users', require('../scripts/user').find);

router.get('/users/:id', require('../scripts/user').get);

router.put('/users/:id', require('../scripts/user').put);

router["delete"]('/users/:id', require('../scripts/user')["delete"]);

//User Panel

module.exports = router;
