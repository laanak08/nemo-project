module.exports = function(){
	var bcrypt = require('bcrypt'),
		SALT_WORK_FACTOR = 10,
		mongoose = require('mongoose');

	// Connect to Mongo
	/*
		If you start getting Mongo errors try wiping your Database:
		mongo <dbname> --eval "db.dropDatabase()"
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
		api: {
			name: {type: String},
			url: {type: String},
			guest_url: {type: String},
			client_id: {type: String}
		},
		username: { type: String},
		password: { type: String},
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
				var db = require('./db');
				var indexRoute = require('../routes/index')(db);
				req.user = newUser;
				indexRoute.index(req, res);
			});
		},
	};
}();
