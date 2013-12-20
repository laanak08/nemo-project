
/*
 * GET home page.
 */
/*

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/
'use strict';
var request_module = require("request");
var request = request_module.defaults({ json: true });


var siteUrl = "https://api.imgur.com/3/gallery/hot/0";
var clientID = "248a22763e9b17e";

var options = {
	url: siteUrl,
	headers : {
    	'Authorization': 'Client-ID ' + clientID

	}
};

function callback(error, response, body) {
	var images = new Array();
	info = JSON.parse(body);
	info.forEach(function(){
		images
	});
}

request( options, callback );

/*
images = []
for each in response.body['data']:
	imgID = each['id']
	imgUrl = "http://i.imgur.com/" + imgID + "b.jpg"
	img = "<img src=" + imgUrl + ">"
	images.append( imgUrl )
*/