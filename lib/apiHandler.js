var	security = require('../lib/secure');
var request = require('request');
var apis = require('./apis');

exports.retrieveUser = function(token, provider, callback) {
	var options = {};
	options.url = apis[provider].url;
	options.headers = { 'Authorization' : 'Bearer ' + token };

	if(apis[provider].type == "oauth1") {
		var h = {};

		h.oauth_consumer_key = apis[provider].consumer_key;
		h.oauth_nonce = security.uniqid("md5", "hex");
		h.oauth_timestamp = Math.floor((new Date()).getTime() / 1000);
		h.oauth_version = "1.0";
		h.oauth_token = token.oauth_token;
		h.oauth_signature_method = "HMAC-SHA1";

		h.oauth_signature = encodeURIComponent(
			security.sign_hmac_sha1('GET', apis[provider].url, 
				apis[provider].consumer_secret + "&" + token.oauth_token_secret, h ) );

		options.headers = { 'Authorization' : security.build_auth_string(h) };
	}

	request(options, function(e, r, body) {
    	if(body)
	    	callback(JSON.parse(body));
    });
};
