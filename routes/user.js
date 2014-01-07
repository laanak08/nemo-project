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

				req.logIn(user, function(err) {
					if (err) {
						console.log(err);
						return next(err);
					}

					console.log(user.username + " login successful");
					indexRoute.new_content(req, res);
				});
			});
		},

		update: function(req, res){
			console.log(req.body);

			var apiData = {
				name: req.body.provider,
				access_token: req.body.token,
				// refresh_token: req.body.refresh_token,
				// endpoint: req.body.endpoints,
				groupName: req.body.groupName
			};

			db.userCrud('add','api',req.user, apiData, function(err, user){
				console.log("saved to user: " + user);
				res.send("/");
			});
		}

	};
};