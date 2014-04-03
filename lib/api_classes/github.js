module.exports = {
	endpoints:{
		account: "https://api.github.com/user"
	},
	type: "oauth2",
	toHTML: function(body){
		var response = [];
		var obj = {
			avatarUrl : body.avatar_url,
			url : body.url,
			repos : body.public_repos,
			name : body.name,
			login : body.login,
		};
		var structuredPost = to_html(obj);
		response.push(structuredPost);
		return response;
	},
	toPostFormat: function(body){
		var response = [];
		var obj = {
			// add image and caption and details keys
			avatarUrl : body.avatar_url,
			url : body.url,
			repos : body.public_repos,
			name : body.name,
			login : body.login,
		};
		response.push(obj);
		return response;		
	}
};

function to_html(obj){
	var structuredPost = "<div class='large-3 large-offset-2 small-6 columns'>";
	structuredPost += obj.avatarUrl + "<br>" +
		obj.url + "<br>" +
		obj.repos + "<br>" +
		obj.name + "<br>" +
		obj.login + "<br>" + "</div>";
	return structuredPost;
}