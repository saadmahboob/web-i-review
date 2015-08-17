var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// MongoDB object modeling
var mongoose = require('mongoose'); 
// Session and Authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'supermassive blackhole sun', saveUninitialized: false, resave: false}));
app.use(passport.initialize());
app.use(passport.session());
// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.message,
      success = req.session.success;
  delete req.session.error;
  delete req.session.message;
  delete req.session.success;
  if (err) res.locals.error = err;
  if (msg) res.locals.message = msg;
  if (success) res.locals.success = success;

  next();
});

var local_database_name = 'ireview';
var local_database_uri  = 'mongodb://localhost/' + local_database_name; // Build the connection string 
var database_uri = local_database_uri; 
mongoose.connect(database_uri); // Create the database connection 
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + database_uri);
}); 
// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

// Simple route middleware to ensure user is authenticated. 
ensureAuthenticated = function(req, res, next) { 
  if (req.isAuthenticated()) { 
	return next();
  }
  else {
	req.session.message = 'You must be logged in to continue'; 
    res.redirect('/login'); 
  }
} 

// Routing
var landing = require('./routes/index');
var members = require('./routes/api/members');
var items = require('./routes/api/items');
var reviews = require('./routes/api/reviews');
var posts = require('./routes/api/posts');
var comments = require('./routes/api/comments');

// Session Passport Authentication
passport.use( 'local-signin', new LocalStrategy( {usernameField: 'email', passwordField: 'password'}, members.localAuthenticate ) );
passport.use( 'local-signup', new LocalStrategy( {usernameField: 'email', passwordField: 'password', passReqToCallback : true}, members.localRegistration ) );
passport.serializeUser(members.serializeUser);
passport.deserializeUser(members.deserializeUser);

app.use('/', landing);
app.use('/api/members', members);
app.use('/api/items', items);
app.use('/api/reviews', reviews);
app.use('/api/posts', posts);
//app.use('/api/comments', comments);
app.use('/docs', express.static('./public/swagger-ui/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
