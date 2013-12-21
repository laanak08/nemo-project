
/*
 * GET home page.
 */
/*

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

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


module.exports = function(db){
	return {
		index: function(req, res){
			request( options, function callback(error, response, body) {
				var images = [];
				for( var i in body.data ){
					var imageObject = {};
					imageObject.id = body.data[i].id;
					imageObject.url = "http://i.imgur.com/" + imageObject.id + "b.jpg";
					images.push(imageObject);
				}
				res.render('index', { theBody: images });
			});
		}
	};
};