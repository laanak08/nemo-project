module.exports = {
	facebook: {
		url: "https://graph.facebook.com/me",
		type: "oauth2"
	},
	github: {
		url: "https://api.github.com/user",
		type: "oauth2"
	},
	google: {
		url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
		type: "oauth2"
	},
	imgur: {
		galleryurl: "https://api.imgur.com/3/gallery/hot/0",
		url: "https://api.imgur.com/3/account/me/favorites",
		type: "oauth2",
		consumer_key: "248a22763e9b17e"
	},
	twitter: {
		url: "https://api.twitter.com/1.1/statuses/home_timeline.json",
		type: "oauth1",
		consumer_key: "aw8I1cafrEWWv48hsOz4w",
		consumer_secret: "RWizi2EOLNWpLJ1fwdQODqsWWGdEmZJ7zIVKsa3A"
	}
}
