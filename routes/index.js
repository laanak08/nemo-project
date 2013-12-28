var request_module = require("request");
var request = request_module.defaults({ json: true });
var security = require('../lib/secure');
var ApiHandler = require('../lib/apiHandler');
var Apis = require('../lib/apis');
var async = require('async');
var flatten = require('flat').flatten;

var guestOptions = {
	url: 'https://api.imgur.com/3/gallery/hot/0',
	headers : {
		'Authorization': 'Client-ID 248a22763e9b17e'
	}
};

contentPerPageLimit = 3;
module.exports = function(db){
	return {
		index: function( req, res){
			if( !req.user ){
				request( guestOptions, function callback(error, response, body) {
					var images = ( Apis['imgur'].toHTML(body) );
					res.render('posts', { theBody: images, user: undefined });
				});
			}else{
				var funcs = [];
				for( var i = 0; i < req.user.apis.length; i++ ) {
					// FIXME: ensure each user has at least one acces_token and apiProvider
					var access_token = req.user.apis[i].access_token;
					var apiProvider = req.user.apis[i].name;

					funcs.push( function(callback){
						var options = ApiHandler.retrieveUser(access_token, apiProvider);
						request(options, function(e, r, body) {
							if(e) return callback(e);
							callback(false, body);
						});
					});
				}
				if(req.user.apis.length === 0){
					request( guestOptions, function callback(error, response, body) {
						var images = ( Apis['imgur'].toHTML(body) );
						res.render('posts', { theBody: images, user: req.user });
					});
				}else{
					async.parallel(funcs, function(err, results) {
						if(err) { console.log(err); res.send(500,"Server Error"); return; }
						console.log(results);
						res.render('posts', { theBody: Apis['imgur'].toHTML(results[0]), user: req.user });
						// res.send({api1:results[0], api2:results[1]});
					});
				}
			}
		}
	};
};

// if ( ! access_token) {
// 	access_token = {
// 		oauth_token: req.body.oauth_token,
// 		oauth_token_secret: req.body.oauth_token_secret
// 	};
// }

// request.post({
// 	url: 'https://oauth.io/auth/access_token',
// 	form: {
// 		code: access_token,
// 		key: "XjlzBRnDXCXYM9pRjBIisrXK8Kc",   // The public key from oauth.io
// 		secret: "JeKgjN0lnoQ-evA6J4xNsX9So5o" // The secret key from oauth.io
// 	}
// }, function (e,r,body) {
// 	console.log(body);
// 	var check = security.check(req, body.state);

// 	if (check.error)
// 		return res.json(check);

// 	ApiHandler.retrieveUser(body.access_token, apiProvider, function(data){
// 		console.log(data);
// 	});
// });
