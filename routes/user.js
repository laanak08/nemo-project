var Apis = require('../lib/apis');

module.exports = function(db){

	return {

		login: function(req, res){},

		logout: function(req, res){
			req.logout();
			res.redirect('/');
		},

		signup: function(req, res){
			db.saveUser(req.body, function(err, user){
				if(err){
					console.log(err);
					return res.send("user didn't save correctly");
				}
				var indexRoute = require('../routes/index')(db);

				req.logIn(user, function(err) {
					if (err) {
						console.log(err);
						return res.redirect('/');
					}

					console.log(user.username + " login successful");
					indexRoute.new_content(req, res);
				});
			});
		},

		update: function(req, res){
			var provider = req.body.provider;

			var apiData = {
				name: provider,
				access_token: req.body.token,
				// refresh_token: req.body.refresh_token,
				endpoints: Object.keys(Apis[provider].endpoints)
			};

			db.userCrud('add','api',req.user, apiData, function(err, user){
				console.log("saved to user: " + user);
				res.send("/");
			});
		},

		addCollection: function(req, res){
			var newCollection = req.body.newCollection;
			var user = req.user;

			var collection = [];
			for( var i = 0; i < newCollection.length; i++ ){
				var apiName = newCollection[i];
				for( var j = 0; j < user.apis.length; j++ ){
					if(user.apis[j].name === apiName){
						collection.push(user.apis[j].id);
					}
				}
			}

			if(collection.length === 0){
				console.log("Collection NOT created".red);
				return res.send('/');
			}

			var collObject = {
				name: req.body.collectionName,
				apiIDs: collection
			};

			db.userCrud('add', 'collection', req.user, collObject, function(err, user){
				console.log("saved to user: " + user);
				res.send('/');
			});
		},

		getCollection: function(req, res){
			var collectionName = req.query.collectionName;
			var user = req.user;
			var apis = [];
			var apiIDs = user.getCollectionIDs(collectionName);
			for( var i = 0; i < apiIDs.length; i++ ){
				var apiObject = user.getApiById(apiIDs[i]);
				if(apiObject !== -1){
					apis.push({name: apiObject.name});
				}
			}
			res.send(apis);
		}
	};
};