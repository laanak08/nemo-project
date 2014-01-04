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
					return res.send('problems');
				}
				var indexRoute = require('../routes/index')(db);
				req.user = user;
				indexRoute.index(req, res);
			});
		},

		update: function(req, res){
			console.log(req.body);
			var access_token = req.body.token;
			var apiProvider = req.body.provider;
			// var refresh_token = req.body.refresh_token;

			db.saveApi(req.user, {
				name: apiProvider,
				access_token: access_token,
				// refresh_token: refresh_token
			}, function(err, user){
				console.log("saved to user: " + user);
				res.send("/");
			});
		}

	};
};