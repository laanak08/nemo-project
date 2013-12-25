$(document).ready(function(){

	'use strict';
	// onload, default user assumed to be guest
	// FIXME: store current user in cache. check there first to decide
	// what to set user var to.
	var user = 'guest';
	var csrf_token = '';
	// FIXME: use #authorizeAPI in future
	// #signIn is just a convenient button to use for
	// temporary testing of the api authorization functionality
	$("#signIn").click(function(){
		if( 'guest' === user ) {

			// get csrf_token
			$.ajax({
				method: 'GET',
				url: '/csrf_token',
				success: function(data){
					csrf_token = data.csrf_token;
				}
			});

			// begin access_token requst process from api using oAuth.io module
			OAuth.initialize('XjlzBRnDXCXYM9pRjBIisrXK8Kc');

			var apiProvider = 'imgur';
			OAuth.popup(apiProvider, { 'state' : csrf_token }, function(err, result) {
				if(err) {
					alert("error: " + error);
					return;
				}

				console.log(result.access_token);

				$.ajax({
					method: 'POST',
					url: '/pull',
					data: { 
						token: result.access_token,
						provider: apiProvider
					},
					success: function(data){
						// FIXME: log in a real user from the database
						// and change client-side state to reflect that.
						// Additionally, cache the current user state
						// so that it can be read later if site closed
						// and state needs to be restored.
						user = 'default';
						console.log(data.theBody);
						clear_and_render(data.theBody);
					}
				});
			});
		} else {
			// FIXME: read user state from cache
			// restore session
		}
	});
});

function clear_and_render(posts) {
	$postDisplay = $("#allPosts");
	$postDisplay.empty();

	var structuredPost = "";
	for(var i in posts) {
		structuredPost = "<div class='row post'>";

		structuredPost += "<div class='large-3 large-offset-2 small-6 columns'>";
		var postImg = "<img src='http://i.imgur.com/" + 
			posts[i].id + "b.jpg' class='left'>";
		structuredPost += postImg + "</div>";

		structuredPost += "<div class='large-4 small-6 columns left'>";
		var postTitle = "<span class='caption'>" + posts[i].title + "</span>";
		structuredPost += postTitle + "</div>";

		structuredPost += "</div>";

		$postDisplay.append(structuredPost);
		structuredPost = "";
	} 
}

// FIXME: OLD CODE to display over and login screen
// 	/*
// 	$("#signIn").click(function(){
// 		$("#overlay").css({"opacity: .8"; display: block});
// 		$("#loginOverlay").css({display: block});
// 	});

// 	$("#overlayClose").click(function(){
// 		$("#overlay").css({display: none});
// 		$("#loginOverlay").css({display: none});
// 	}); */