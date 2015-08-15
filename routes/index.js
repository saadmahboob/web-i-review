var express = require('express');
var router = express.Router();
var http = require('http');
var Member = require('../models/member');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home', { title: 'Testing!' });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
	/*http.request(req, function(response) {
		if(response.status() == 200) {
			res.status(200).end();
		}
		else {
			res.status(response.status()).end();
		}
	}).end();*/
	res.redirect('/');
});

module.exports = router;
