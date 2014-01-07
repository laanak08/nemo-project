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
		endpoints: [String]
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
		apiGroups: [ apiGroupSchema ]
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
		saveUser: function(body, callback){
			var newUser = new User({
				username: body.username,
				password: body.password,
				apiGroups: [
					{
						name: 'Starter Kit',
						apis: [
							{
								name: 'imgur',
								access_token: 'no access_token',
								refresh_token: 'no refresh_token',
								endpoints: ['gallery', 'favorites']
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
				console.log("new user: " + newUser);
				callback(null, newUser);
			});
		},
		userCrud: function (operation, structure, userData, apiData, callback){
			User.findOne({username: userData.username}, function(err, user) {
				if(structure === 'api'){
					crud_api(operation, user, apiData, callback);
				} else {
					crud_api_group(operation, user, apiData, callback);
				}

				user.save(function(err){
					if(err) return callback(err);
					console.log("User Succeeded in adding API " + apiData.name);
					callback(null, user);
				});
			});
		}
	};
}();

function crud_api(operation, user, apiData, callback){
	var apiIndex = -1,
		groupIndex = find_group(user, apiData.groupName);
	if(groupIndex !== -1)
		apiIndex = find_api(user, apiData.name, groupIndex);

	switch(operation) {
		case 'add':
			if(groupIndex !== -1){
				if(apiIndex !== -1){
					var Api = user.apiGroups[groupIndex].apis[apiIndex];
					Api.access_token = apiData.access_token;
					// Api.refresh_token = apiData.refresh_token;
					// Api.endpoints = apiData.endpoints;
				} else {
					user.apiGroups[groupIndex].apis.push({
						name: apiData.name,
						access_token: apiData.access_token//,
						// refresh_token: 'no refresh_token',
						// endpoints: apiData.endpoints
					});
				}
			} else {
				// rovision for if trying to add api to non-existent group
				user.apiGroups.push({
					name: apiData.groupName,
					apis: [
						{
							name: apiData.name,
							access_token: apiData.access_token//,
							// refresh_token: 'no refresh_token',
							// endpoints: apiData.endpoints
						}
					]
				});
			}
			break;
		case 'remove':
			if(apiIndex !== -1)
				user.apiGroups[groupIndex].apis[apiIndex].remove();
			break;
		default:
			var errMsg = 'invalid api operation attempted';
			return callback(errMsg);
	}
}

function crud_api_group(operation, user, apiData, callback){
	var groupIndex = find_group(user, apiData.groupName);
	switch(operation) {
		case 'add':
			if( groupIndex === -1){
				user.apiGroups.push({
					name: apiData.groupName,
					apis: apis
				});
			} else {
				user.apiGroups[groupIndex].name = apiData.groupName;
				// FIXME: update apis after updating groupname
			}
			break;
		case 'remove':
			if( groupIndex !== -1)
				user.apiGroups[groupIndex].remove();
			break;
		default:
			var errMsg = 'invalid group operation attempted';
			return callback(errMsg);
	}
}

function find_group(user, groupName){
	var numApiGroups = user.apiGroups.length;
	for(var i = 0; i < numApiGroups; i++){
		if( user.apiGroups[i].name === groupName ){
			return i;
		}
	}
	return -1;
}

function find_api(user, apiName, groupIndex){
	console.log("groupIndex: "+groupIndex);
	var numApis = user.apiGroups[groupIndex].apis.length;
	for(var i = 0; i < numApis; i++){
		var Api = user.apiGroups[groupIndex].apis[i];
		if(Api.name === apiName) {
			return i;
		}
	}
	return -1;
}