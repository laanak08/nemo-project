var request_module = require("request");
var request = request_module.defaults({ json: true });
var security = require('../lib/secure');
var ApiHandler = require('../lib/apiHandler');

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
			console.log(req.user);
			if(!req.user){
				request( guestOptions, function callback(error, response, body) {
					var images = display_imgur_images(body);	
					res.render('images', { theBody: images, user: undefined });
				});
			}else{
				// 3. request api content
				var response = [];
				console.log(req.user);
				// 1. get user from DB (db function)
				for( i in req.user.apis ) {
					// 2. FIXME:// check access_tokens from user account
					var access_token = req.user.apis[i].access_token;
					var apiProvider = req.user.apis[i].name;

					ApiHandler.retrieveUser(access_token, apiProvider, function(data){
						var images = display_imgur_images(data);
						response.push(images);
					});
				}

				console.log(response);
				// 4. render content to ejs
				res.render('posts',{ theBody: response });
			}
		}		
	};
};

function display_imgur_images(body){
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
	return images;
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
// 		key: "XjlzBRnDXCXYM9pRjBIisrXK8Kc",            // The public key from oauth.io
// 		secret: "JeKgjN0lnoQ-evA6J4xNsX9So5o"         // The secret key from oauth.io
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
