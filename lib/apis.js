var imgur = require('./api_classes/imgur');
var github = require('./api_classes/github');

module.exports = {
	facebook: {
		url: "https://graph.facebook.com/me",
		type: "oauth2"
	},
	github: {
		url: github.url,
		type: github.type,
		toHTML: github.toHTML
	},
	google: {
		url: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
		type: "oauth2"
	},
	imgur: {
		consumer_key: imgur.consumer_key,
		url: imgur.url,
		galleryurl: imgur.galleryurl,
		type: imgur.type,
		toHTML: imgur.toHTML
	},
	twitter: {
		url: "https://api.twitter.com/1.1/statuses/home_timeline.json",
		type: "oauth1",
		consumer_key: "aw8I1cafrEWWv48hsOz4w",
		consumer_secret: "RWizi2EOLNWpLJ1fwdQODqsWWGdEmZJ7zIVKsa3A"
	}
}
