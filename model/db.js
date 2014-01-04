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
		// refresh_token: {type: String}
	});

	var userSchema = mongoose.Schema({
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true},
		apiNames: [],
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
		saveUser: function(body, callback){
			var newUser = new User({
				username: body.username,
				password: body.password
			});
			newUser.save(function(err, newUser){
				if(err) {
					console.log(err);
					return callback(err);
				}
				console.log("new user: " + newUser.username);
				callback(null, newUser);
			});
		},
		saveApi: function(userData, apiData, callback){
			User.findOne({username: userData.username}, function(err, user) {
				if(err) return callback(err);

				// only push api schema if new api schema
				// ie. prevent repeats and inconsistencies
				if(user.apiNames.indexOf(apiData.name) === -1 ) {
					user.apiNames.push(apiData.name);
					user.apis.push({
						name: apiData.name,
						access_token: apiData.access_token
						// refresh_token: apiData.refresh_token
					});
				}else { // old token needs updating
					//FIXME: need way to find and update apis tokens
				}

				user.save(function(err){
					if(err) return callback(err);
					console.log("User Succeeded in adding API " + apiData.name);
					callback(null, user);
				});
			});
		},
	};
}();
