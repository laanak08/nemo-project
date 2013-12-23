var crypto = require('crypto');

exports.generate_CSRF_token = function( req ) {
	var shasum = crypto.createHash('sha1');

	shasum.update("flkrjoeivr"); //random static string
	shasum.update( (new Date()).getTime() +	':' + 
		Math.floor(Math.random()*9999999) );

	var uid = shasum.digest('base64');

	var csrf_token = uid.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

	req.session.csrf_tokens = req.session.csrf_tokens || [];
	req.session.csrf_tokens.push(csrf_token);
	if (req.session.csrf_tokens.length > 4)
	    req.session.csrf_tokens.shift(); // keep 4 tokens max
	return csrf_token;
}