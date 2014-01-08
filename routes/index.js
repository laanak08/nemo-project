var request_module = require("request"),
	request = request_module.defaults({ json: true }),
	ApiHandler = require('../lib/apiHandler'),
	Apis = require('../lib/apis'),
	async = require('async');

function default_page(render){
	var images = [],
		posts = [];
	var guestOptions = ApiHandler.retrieveUser('no access_token', 'imgur', 'gallery');
	request( guestOptions, function (error, response, body) {
		images = ( Apis['imgur'].toHTML(body) );
		posts.push(images);
		render(posts);
	});
}

var genFunc = function (access_token, apiProvider, endpoint){
	var options = ApiHandler.retrieveUser(access_token, apiProvider, endpoint);
	return function (callback){
		request(options, function (e, r, body) {
			console.log(apiProvider);
			if(e) return callback(e);
			var html = Apis[apiProvider].toHTML(body);
			callback(false, html);
		});
	};
};

function get_user_content(req, res, render){
	var user = req.user;
	var funcs = [];
	var numApis = user.apis.length;

	for(var i = 0; i < numApis; i++){

		var Api = user.apis[i];
		var access_token = Api.access_token;
		var apiProvider = Api.name;


		var endpoint = Api.endpoints['favorites'];

		// check if access token has expired
		// 		yes: request new token
		// 			update user account with new token
		// 			load '/'

		console.log("access_token: " + access_token +
		" apiProvider " + apiProvider +
		" endpoint: " + endpoint);
		funcs.push( genFunc(access_token, apiProvider, endpoint) );

	}

	async.parallel(funcs, function (err, results) {
		if(err) { console.log("routes/index.js(61): "+err); res.send(500,"Server Error"); return; }
		render(results);
	});
}

function new_content( req, res, render){
	if( (!req.user) || (req.user.apis.length === 0) ){
		default_page( render );
	}else{
		get_user_content(req, res, render);
	}
}

module.exports = function (db){
	return {
		friend_feed: function (req, res){
			new_content( req, res, function (data){
				res.render('posts', { theBody: data, user: req.user, activePage: 'buzzfeed' });
			});
		},
		new_content: function (req, res){
			new_content( req, res, function (data){
				res.render('posts', { theBody: data, user: req.user, activePage: 'newfeed' });
			});
		},
		favorites: function (req, res){
			new_content( req, res, function (data){
				res.render('posts', { theBody: data, user: req.user, activePage: 'favorites' });
			});
		},
		blog: function (req, res){
			new_content( req, res, function (data){
				res.render('posts', { theBody: data, user: req.user, activePage: 'blogfeed' });
			});
		}
	};
};