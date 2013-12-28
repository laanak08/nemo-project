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
			var access_token = req.body.token;
			var apiProvider = req.body.provider;

			db.saveApi(req.user, {
				name: apiProvider,
				access_token: access_token
			}, function(err, user){
				console.log("saved to user: " + user);
				res.redirect("/");
			});
		}

	};
};