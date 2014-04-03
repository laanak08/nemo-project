module.exports = {
	endpoints: {
		gallery: "https://api.imgur.com/3/gallery/hot/0",
		favorites: "https://api.imgur.com/3/account/me/favorites"
	},
	type: "oauth2",
	consumer_key: "248a22763e9b17e",
	toHTML: function(body){
		var response = [];
		for( var i in body.data ){
			var imageObject = {
				id : body.data[i].id,
				title : body.data[i].title,
				url : "http://i.imgur.com/" + body.data[i].id + "b.jpg"
			};
			var structuredPost = to_html(imageObject);
			response.push(structuredPost);
		}
		return response;
	},
	toPostFormat: function(body){
		var response = [];
		for( var i in body.data ){
			var imageObject = {
				id : body.data[i].id,
				caption : body.data[i].title,
				image : "http://i.imgur.com/" + body.data[i].id + "b.jpg"
			};
			response.push(imageObject);
		}
		return response;		
	}
};

function to_html(imageObject){
	var structuredPost = "<div class='large-3 large-offset-2 small-6 columns'>";
	var postImg = "<img src='" + imageObject.url + "'>";
	structuredPost += postImg + "</div>";

	structuredPost += "<div class='large-4 small-6 columns left'>";
	var postTitle = "<span class='caption'>" + imageObject.title + "</span>";
	structuredPost += postTitle + "</div>";
	return structuredPost;
}