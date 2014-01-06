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

	// FIXME: Set up User Schema this should be taken out and put into a User class at some point
	var apiSchema = mongoose.Schema({
		name: {type: String},
		access_token: {type: String},
		refresh_token: {type: String},
		endpoints: []
	});

	var apiGroupSchema = mongoose.Schema({
		name: { type: String },
		apis: [ apiSchema ]
	});
	
	// var apiGroupSchema = mongoose.Schema({
	// 	name: { type: String },
	// 	apis: [apiSchema],
	//	favorites: [ postSchema ]
	// });

	var userSchema = mongoose.Schema({
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true},
		apiGroups: [apiGroupSchema]
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
				password: body.password,
				apiGroups: [
					{
						name: 'StarterKit',					
						apis: [
							{
								name: 'github',
								access_token: 'no access_token',
								refresh_token: 'no refresh_token',
								endpoints: ['account']
							},
							{
								name: 'imgur',
								access_token: 'no access_token',
								refresh_token: 'no refresh_token',
								endpoints: ['gallery']
							}
						]
					}
				]
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

				var access_token_changed = false;

				var numApiGroups = user.apiGroups.length;
				for(var i = 0; i < numApiGroups; i++){

					var numApis = user.apiGroups[i].apis.length;
					for(var j = 0; j < numApis; j++){

						var Api = user.apiGroups[i].apis[j];
						if(Api.name === apiData.name) {
							Api.access_token = apiData.access_token;
							access_token_changed = true;
							break;
						}
					}
				}

				// FIXME: add endpoints key and refresh_token key
				if(!access_token_changed){
					user.apiGroups.apis.push({
						name: apiData.name,
						access_token: apiData.access_token
					});
				}

				console.log(user);

				user.save(function(err){
					if(err) return callback(err);
					console.log("User Succeeded in adding API " + apiData.name);
					callback(null, user);
				});
			});
		},
	};
}();
