/**
 * Module dependencies.
 */
colors = require('colors');

var express = require('express'),
	app = express(),
	http = require('http'),
	path = require('path'),
	engine = require('ejs-locals'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	mongoose = require('mongoose'),
	redis = require('redis'),
	RedisStore = require('connect-redis')(express),

	db = require('./model/db'),
	auth = require('./model/auth')(passport, LocalStrategy),
	userRoute = require('./routes/user')(db),
	indexRoute = require('./routes/index')(db);

if (process.env.REDISTOGO_URL) {
	var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redisClient = require("redis").createClient(rtg.port, rtg.hostname);
	redisClient.auth(rtg.auth.split(":")[1]);
} else {
	var redisClient = require("redis").createClient();
}

var cookieMaxAge = 90000000;
var sessionStore = new RedisStore({
	client: redisClient,
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser('app cookie secret'));
app.use(express.session({
	key: 'cookieKey',
	store: sessionStore,
	secret: 'app cookie secret',
	cookie: { maxAge: (cookieMaxAge !== 0) ? cookieMaxAge : null }
}));
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

app.get('/', indexRoute.new_content);
app.get('/buzz', indexRoute.friend_feed);
app.get('/new', indexRoute.new_content);
app.get('/favorites', indexRoute.favorites);
app.get('/blog', indexRoute.blog);

// app.get('/collection:' userRoute.showCollections);

app.post('/collection', userRoute.addCollection);
app.get('/collection', userRoute.getCollection);

app.get('/apis', userRoute.getApis);

app.post('/', userRoute.update);

var csrf_token = require('./routes/forge_token');
app.get('/csrf_token',csrf_token.csrf_token);

app.get('/admin', auth.ensureAuthenticated, function(req, res){
	User.find({}, function (err, users) {
		var userMap = {};
		users.forEach(function(user) {
			userMap[user._id] = user;
		});
		console.log(userMap);
		res.render('admin', {users: userMap});
	});
});

app.post('/sign-up', userRoute.signup);
app.post('/login', auth.authenticate, userRoute.login);
app.get('/logout', userRoute.logout);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
