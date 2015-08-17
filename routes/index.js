var express = require('express');
var router = express.Router();
var request = require('request');
var Member = require('../models/member');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('home', { title: 'Testing!', user: req.user});
});

router.get('/login', function(req, res) {
    res.render('login', { userNavLoginOff: 'true', message: res.locals.message });
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local-signin', function(err, user, info) {
		if (err) { 
			return next(err); 
		}
		if (!user) {
			req.session.message = info.message;
			return res.redirect('/login');
		}
		req.logIn(user, function(err) {
			if (err) { 
				return next(err); 
			}
			else {
				return res.redirect('/');
				
			}
		});
	})(req, res, next);
});

router.get('/logout', function(req, res) {
	req.logout();
    res.redirect('/');
});

router.get('/register', function(req, res) {
    res.render('register', { userNavLoginOff: 'true', message: res.locals.message });
});

router.post('/register', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) { 
			return next(err); 
		}
		else if (!user) {
			req.session.message = info.message;
			return res.redirect('/register');
		}
		else {
			req.logIn(user, function(err) {
				if (err) { 
					return next(err); 
				}
				else {
					return res.redirect('/');
				}
			});
		}
	})(req, res, next);
});

module.exports = router;
