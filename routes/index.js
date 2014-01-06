var request_module = require("request"),
	request = request_module.defaults({ json: true }),
	ApiHandler = require('../lib/apiHandler'),
	Apis = require('../lib/apis'),
	async = require('async');

var guestOptions = {
	url: 'https://api.imgur.com/3/gallery/hot/0',
	headers : {
		'Authorization': 'Client-ID 248a22763e9b17e'
	}
};

//TODO: come up with default api mixture for page
function default_page(render){
	var images = [],
		posts = [];
	request( guestOptions, function (error, response, body) {
		images = ( Apis['imgur'].toHTML(body) );
		posts.push(images);
		render(posts);
	});
}

var genFunc = function (access_token, apiProvider, url){
	var options = ApiHandler.retrieveUser(access_token, apiProvider, url);
	return function (callback){
		request(options, function (e, r, body) {
			if(e) return callback(e);
			var html = Apis[apiProvider].toHTML(body);
			callback(false, html);
		});
	};
};

function get_user_content(req, res, render){
	var user = req.user;
	var funcs = [];

	// var numApis = user.apis.length;
	// for(var i = 0; i < numApis; i++){
	var numApiGroups = user.apiGroups.length;
	for(var i = 0; i < numApiGroups; i++){

		var numApis = user.apiGroups[i].apis.length;
		for(var j = 0; j < numApis; j++){

			// var endpoint = user.apiGroups[i].apis[j].endpoints[0]; //FIXME: loop through all endpoints
			var Api = user.apiGroups[i].apis[j];

			// var access_token = user.apis[i].access_token ;// Api.access_token;
			var access_token = Api.access_token;
			// var apiProvider = user.apis[i].name;// Api.name;
			var apiProvider = Api.name;
			var url = Apis[apiProvider].url ;
			// var url = Apis[apiProvider].endpoints[endpoint];

			// check if access token has expired
			// 		yes: request new token
			// 			update user account with new token
			// 			load '/'

			funcs.push( genFunc(access_token, apiProvider, url) );
		}
	}

	async.parallel(funcs, function (err, results) {
		if(err) { console.log(err); res.send(500,"Server Error"); return; }
		render(results);
	});
}

function new_content( req, res, render){
	// if( (!req.user) || (req.user.apis.length === 0) ) {
	if( (!req.user) || (req.user.apiGroups.length === 0) ){
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