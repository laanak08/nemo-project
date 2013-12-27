module.exports = function(db){

	return {

		login: function(req, res){},

		logout: function(req, res){
			req.logout();
			res.redirect('/');
		},

		signup: function(req, res){
			db.saveUser(req, res);
		},

		update: function(req, res){
			console.log(req.user);
			// var access_token = req.body.token;
			// var apiProvider = req.body.provider;
		}

	};
};