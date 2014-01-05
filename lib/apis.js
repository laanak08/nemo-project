module.exports = {
	facebook: {
		url: "https://graph.facebook.com/me",
		type: "oauth2"
	},
	github: {
		url: "https://api.github.com/user",
		type: "oauth2",
		toHTML: function(body){
			var response = [];
			var obj = {};
			obj.avatarUrl = body.avatar_url;
			obj.url = body.url;
			obj.repos = body.public_repos;
			obj.name = body.name;
			obj.login = body.login;

			var structuredPost = "<div class='large-3 large-offset-2 small-6 columns'>";
			structuredPost += obj.avatarUrl + "<br>" +
				obj.url + "<br>" +
				obj.repos + "<br>" +
				obj.name + "<br>" +
				obj.login + "<br>" + "</div>";

			response.push(structuredPost);
			return response;
		}
	},
	google: {
		url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
		type: "oauth2"
	},
	imgur: {
		galleryurl: "https://api.imgur.com/3/gallery/hot/0",
		url: "https://api.imgur.com/3/account/me/favorites",
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
	},
	twitter: {
		url: "https://api.twitter.com/1.1/statuses/home_timeline.json",
		type: "oauth1",
		consumer_key: "aw8I1cafrEWWv48hsOz4w",
		consumer_secret: "RWizi2EOLNWpLJ1fwdQODqsWWGdEmZJ7zIVKsa3A"
	}
}
