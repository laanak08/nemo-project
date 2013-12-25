
/**
 * Module dependencies.
 */

var express = require('express'),
	app = express(),
	http = require('http'),
	path = require('path'),
	engine = require('ejs-locals'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	// bcrypt = require('bcrypt'), // missing package.json line: "bcrypt": "~0.7.7",
	SALT_WORK_FACTOR = 10,
	mongoose = require('mongoose'),

	db = require('./model/db'),
	auth = require('./model/auth')(passport, LocalStrategy),

	userRoute = require('./routes/user')(db),
	indexRoute = require('./routes/index')(db);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: "crumbs"}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', indexRoute.index);
var csrf_token = require('./routes/forge_token');
app.get('/csrf_token',csrf_token.csrf_token);
app.post('/pull',indexRoute.pull);

//app.post('/signup', userRoute.signup);
//app.post('/login', auth.authenticate, userRoute.login);
//app.get('/logout', userRoute.logout);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
