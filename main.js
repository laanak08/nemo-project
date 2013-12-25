var request_module = require("request");
var request = request_module.defaults({ json: true });

var imgurUrl = "https://api.imgur.com/3/gallery/hot/0";
var clientID = "248a22763e9b17e";

var imgur = {
	url: imgurUrl,
	headers : {
		'Authorization': 'Client-ID ' + clientID
	}
};

var twitter = {
	url: 
	headers: {
		'Authorization': 'OAuth oauth_consumer_key="aw8I1cafrEWWv48hsOz4w", ' +
			'oauth_nonce="0c7ea250095d8ad7d2c1fe60cc29507f", ' +
			'oauth_signature="o9pPiQutNe9w0M3R06qXfAqi4Dk%3D", ' +
			'oauth_signature_method="HMAC-SHA1", ' + 
			'oauth_timestamp="1387681463", ' +
			'oauth_token="2256552770-nTKawQPFbtSrwG5ueHbUiIoPO7bTvi4OIirhCV2",' +
			'oauth_version="1.0"'
	}
};

exports.index = function(req, res){
			
	request( imgur, function callback(error, response, body) {
		var images = [];
		for( var i in body.data ){
			var imageObject = {};
			imageObject.id = body.data[i].id;
			imageObject.url = "http://i.imgur.com/" + imageObject.id + "b.jpg";
			imageObject.title = body.data[i].title;
			images.push(imageObject);
		}
		res.render('images', { theBody: images });
	});

	request( twitter, function callback(error, response, body) {
		console.log(body);
		// var tweets = [];
		// for( var i in body.data ){
		// 	var imageObject = {};
		// 	imageObject.id = body.data[i].id;
		// 	images.push(imageObject);
		// }
		// res.render('images', { theBody: images });
	});

};