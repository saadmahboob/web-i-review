var express = require('express');
var router = express.Router();
var request = require('request');
var Member = require('../models/member');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home', { title: 'Testing!' });
});

router.get('/login', function(req, res) {
    res.render('login', { });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
	var formData = {
		email: 				req.body.emailAddr,
		hashedPassword:		req.body.pass,
		firstName:			req.body.firstName,
		lastName:			req.body.lastName
	};
	request.post({url:'http://localhost:3000/api/members', form: formData}, callback)
	function callback (error, httpResponse, body) { 
		if (error) {
			res.render('error', {message: err.message, error: error});
		}
		else if (httpResponse.statusCode == 200) {
			res.redirect('/');
		}
		else { //TODO expand else statements for specific error codes, and change user error handling
			res.render('register', {message: 'An error occured: ' + httpResponse.statusCode});
		}
	}
});

module.exports = router;
