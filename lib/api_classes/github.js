module.exports = {
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
}