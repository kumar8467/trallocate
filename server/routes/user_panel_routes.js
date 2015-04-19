var express, router;

express = require('express');
router = express.Router();

var React = require('react')
var path    = require("path");

router.get('/', function(req, res, next) {
	console.log('******** in user panel ********');
	res.sendFile(path.join(__dirname+'../../../assets/dist/index.html'));
	next();
});
// router.post('/api/v1/authenticate', require('../scripts/user_panel_authentication').init);
router.post('/api/v1/authenticate', require('../scripts/authentication').init);

module.exports = router;