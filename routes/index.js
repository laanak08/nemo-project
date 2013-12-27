var request_module = require("request");
var request = request_module.defaults({ json: true });
var security = require('../lib/secure');
var apiHandler = require('../lib/apiHandler');

var siteUrl = "https://api.imgur.com/3/gallery/hot/0";
var clientID = "248a22763e9b17e";

var guestOptions = {
	url: siteUrl,
	headers : {
		'Authorization': 'Client-ID ' + clientID
	}
};

contentPerPageLimit = 3;
module.exports = function(db){
	return {
		index: function(req, res){
			request( guestOptions, function callback(error, response, body) {
				var images = [];
				for( var i in body.data ){
					if(i == contentPerPageLimit)
						break;
					var imageObject = {};
					imageObject.id = body.data[i].id;
					imageObject.url = "http://i.imgur.com/" + imageObject.id + "b.jpg";
					imageObject.title = body.data[i].title;
					images.push(imageObject);
				}
				if(!req.user){
					console.log("no user");
					res.render('images', { theBody: images, user: undefined });
				}else{
					console.log("user " + req.user);
					res.render('images', { theBody: images, user: req.user });
				}
			});
		},

		pull: function(req, res){
			var access_token = req.body.token;
			var apiProvider = req.body.provider;

			// if ( ! access_token) {
			// 	access_token = {
			// 		oauth_token: req.body.oauth_token,
			// 		oauth_token_secret: req.body.oauth_token_secret
			// 	};
			// }

			var options = {
				url: "https://api.imgur.com/3/account/me/favorites",
				headers : {
					'Authorization': 'Bearer ' + access_token
				}
			};

			request(options, function(error, response, body){
				// console.log(body);
				var images = [];
				for( var i in body.data ){
					// if(i == contentPerPageLimit)
					// 	break;
					var imageObject = {};
					imageObject.id = body.data[i].id;
					imageObject.title = body.data[i].title;
					imageObject.url = "http://i.imgur.com/" + imageObject.id + "b.jpg";
					images.push(imageObject);
				}
				res.json({ theBody: images });
			});

			// apiHandler.retrieveUser(access_token, apiProvider, function(data){
			// 	console.log(data);
			// });

			// request.post({
			// 	url: 'https://oauth.io/auth/access_token',
			// 	form: {
			// 		code: access_token,
			// 		key: "XjlzBRnDXCXYM9pRjBIisrXK8Kc",            // The public key from oauth.io
			// 		secret: "JeKgjN0lnoQ-evA6J4xNsX9So5o"         // The secret key from oauth.io
			// 	}
			// }, function (e,r,body) {
			// 	console.log(body);
			// 	var check = security.check(req, body.state);

			// 	if (check.error)
			// 		return res.json(check);

			// 	apiHandler.retrieveUser(body.access_token, apiProvider, function(data){
			// 		console.log(data);
			// 	});
			// });

		}
	};
};