var security = require('../lib/secure');

exports.csrf_token = function(req, res) {
	res.json({
		csrf_token: security.generate_CSRF_token(req)
	});
};