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
			var imageObject = {};
			imageObject.id = body.data[i].id;
			imageObject.title = body.data[i].title;
			imageObject.url = "http://i.imgur.com/" + imageObject.id + "b.jpg";

			var structuredPost = "<div class='large-3 large-offset-2 small-6 columns'>";
			var postImg = "<img src='" + imageObject.url + "b.jpg' class='left'>";
			structuredPost += postImg + "</div>";

			structuredPost += "<div class='large-4 small-6 columns left'>";
			var postTitle = "<span class='caption'>" + imageObject.title + "</span>";
			structuredPost += postTitle + "</div>";

			response.push(structuredPost);
		}
		return response;
	}
}