var	security = require('../lib/secure');
var request = require('request');


exports.data = {
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
		url: "https://api.imgur.com/3/gallery/hot/0",
		type: "oauth2",
		consumer_key: "248a22763e9b17e"
	},
	twitter: {
		url: "https://api.twitter.com/1.1/account/verify_credentials.json",
		type: "oauth1",
		consumer_key: "XXXXX",
		consumer_secret: "XXXXX"
	}
}

exports.retrieveUser = function(token, provider, callback) {
	var qs = null;
	var headers = null;

	if (this.data[provider].type == "oauth1") {
		var h = {};
		h.oauth_consumer_key = this.data[provider].consumer_key;
		h.oauth_nonce = security.uniqid("md5", "hex");
		h.oauth_timestamp = Math.floor((new Date()).getTime() / 1000);
		h.oauth_version = "1.0";
		h.oauth_token = token.oauth_token;
		h.oauth_signature_method = "HMAC-SHA1";
		h.oauth_signature = encodeURIComponent(
			security.sign_hmac_sha1('GET', 
				this.data[provider].url, 
				this.data[provider].consumer_secret + "&" + token.oauth_token_secret, 
				h));
		headers = {"Authorization": security.build_auth_string(h) };
	}
	else {
		qs = {access_token: token};
		// FIXME: some default headers are needed
		// headers = {"Authorization": security.build_auth_string(h) };
	}

	request.get({
    	url: this.data[provider].url,
    	qs: qs,
    	headers: headers
    }, function(e, r, body) {
    	if (body)
	    	callback(JSON.parse(body));
    });
};
