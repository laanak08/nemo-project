module.exports = function(){
	var bcrypt = require('bcrypt'),
		SALT_WORK_FACTOR = 10,
		mongoose = require('mongoose');

	// Connect to Mongo
	/*
		If you start getting Mongo errors try wiping your Database:
		mongo nemo --eval "db.dropDatabase()"
	*/
	var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/nemo';
	mongoose.connect(uristring, function (err, res) {
		if (err) {
			console.log ('ERROR connecting to: ' + uristring + '. ' + err);
		} else {
			console.log ('Succeeded connected to: ' + uristring);
		}
	});

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		console.log("connected to db");
	});

	/* - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *
		Set up User Schema
		- this should be taken out and put into a User class at some point
	 * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - */
	var userApiSchema = mongoose.Schema({
		name: {type: String},
		access_token: {type: String},
	});

	var userSchema = mongoose.Schema({
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true},
		apis: [userApiSchema]
	});

	userSchema.pre('save', function(next) {
		var user = this;

		if(!user.isModified('password')) return next();

		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if(err) return next(err);

			bcrypt.hash(user.password, salt, function(err, hash) {
				if(err) return next(err);
				user.password = hash;
				next();
			});
		});
	});

	userSchema.methods.comparePassword = function(candidatePassword, cb) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if(err) return cb(err);
			cb(null, isMatch);
		});
	};

	User = mongoose.model('User', userSchema);

	return {
		// PUBLIC FUNCTIONS
		saveUser: function( req, res ){
			var userObj = req.body;
			var newUser = new User(userObj);
			newUser.save(function(err, newUser){
				if(err) {
					console.log(err);
					res.send('{err: "'+err+'"}');
					return err;
				}
				console.log("new user: " + newUser.username);
				//Log user in after they have created an account
				// This redirect is kind of a hack to make sure all of the
				// api code goes in indexRoute.index
				var db = require('./db');
				var indexRoute = require('../routes/index')(db);
				req.user = newUser;
				indexRoute.index(req, res);
			});
		},
		saveApi: function(userData, apiData, callback){
			User.findOne({username: userData.username}, function(err, user) {
				if(err) return callback(err);
				user.apis.push({
					name: apiData.name,
					access_token: apiData.access_token
				});
				user.save(function(err){
					if(err) return callback(err);
					console.log("User Succeeded in adding API " + apiData.name);
					callback(err, user);
				});
			});
		},
	};
}();
