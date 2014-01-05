var request_module = require("request");
var request = request_module.defaults({ json: true });
var security = require('../lib/secure');
var ApiHandler = require('../lib/apiHandler');
var Apis = require('../lib/apis');
var async = require('async');
var flatten = require('flat').flatten;

contentPerPageLimit = 3;
module.exports = function(db){
	return {
		index: function( req, res){
			if( !req.user ){
				default_page(res, undefined);
			}else{
				if(req.user.apis.length === 0){
					default_page(res, req.user);
				}else{
					var funcs = [];
					for( var i = 0; i < req.user.apis.length; i++ ) {
						// FIXME: ensure each user has at least one acces_token and apiProvider
						var access_token = req.user.apis[i].access_token;
						var apiProvider = req.user.apis[i].name;

						var genFunc = function(access_token, apiProvider){
							var options = ApiHandler.retrieveUser(access_token, apiProvider);
							return function(callback){
								request(options, function(e, r, body) {
									if(e) return callback(e);
									var html = Apis[apiProvider].toHTML(body);
									callback(false, html);
								});
							};
						};
						
						// call error checking function to determine whether or not access token has expired
						// if expired, request new token
						// 		update user account with new token
						// 		POST request to '/'

						funcs.push( genFunc(access_token,apiProvider) );
					}

					async.parallel(funcs, function(err, results) {
						if(err) { console.log(err); res.send(500,"Server Error"); return; }
						res.render('posts', { theBody: results, user: req.user });
						// res.send({api1:results[0], api2:results[1]});
					});
				}
			}
		}
	};
};


var guestOptions = {
	url: 'https://api.imgur.com/3/gallery/hot/0',
	headers : {
		'Authorization': 'Client-ID 248a22763e9b17e'
	}
};

//TODO: come up with default api mixture for page
function default_page(res, usr){
	request( guestOptions, function callback(error, response, body) {
		var images = ( Apis['imgur'].toHTML(body) );
		var posts = [];
		posts.push(images);
		console.log(posts);
		res.render('posts', { theBody: posts, user: usr });
	});
}
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


