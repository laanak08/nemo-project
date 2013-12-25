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

contentPerPageLimit = 3;
module.exports = function(db){
	return {
		index: function(req, res){
			request( options, function callback(error, response, body) {
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
				res.render('images', { theBody: images });
			});
		}
	};
};