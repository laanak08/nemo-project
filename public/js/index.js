'use strict';
$(document).ready(function(){

	$('.apiAuthenticate').click(function(e){
		e.preventDefault();
		$(".close-reveal-modal").click();
		var apiProvider = $(this).find("a").attr('id').replace('auth','');

		// onload, default user assumed to be guest
		// FIXME: store current user in cache. check there first to decide
		// what to set user var to.
		var user = 'guest';
		var csrf_token = '';
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

			OAuth.popup(apiProvider, { 'state' : csrf_token }, function(err, result) {
				if(err) {
					alert("error: " + error);
					return;
				}

				$.ajax({
					method: 'POST',
					url: '/',
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
						// clear_and_render(data.theBody);
					}
				});
			});
		} else {
			// FIXME: read user state from cache
			// restore session
		}
	});

	// $('.next-sign-up').click(function(e){
	// 	e.preventDefault();
	// 	var password = $('.password').val();
	// 	var username = $('.username').val();
	// 	//This is where we need to do some crypto stuff
	// 	$('#sign-up-collection-modal').foundation('reveal', 'open');

	// 	$('.submit-sign-up').click(function(e){
	// 		var apiKeys = [];
	// 		$("input:checkbox[name=api-checkbox]:checked").each(function()
	// 		{
	// 			apiKeys.push(this.value);
	// 		});
	// 		console.log(apiKeys);
	// 		$.ajax({
	// 			method: 'POST',
	// 			url: '/sign-up',
	// 			data: {
	// 				username: username,
	// 				password: password,
	// 				apiKeys: apiKeys
	// 			},
	// 			success: function(data){
	// 				console.log(data);
	// 				// FIXME: log in a real user from the database
	// 				// and change client-side state to reflect that.
	// 				// Additionally, cache the current user state
	// 				// so that it can be read later if site closed
	// 				// and state needs to be restored.
	// 				// user = 'default';
	// 				// clear_and_render(data.theBody);
	// 			}
	// 		});
	// 	});
	// });

});

// function clear_and_render(posts) {
// 	var $postDisplay = $("#allPosts");
// 	$postDisplay.empty();

// 	var structuredPost = "";
// 	for(var i in posts) {
// 		structuredPost = "<div class='row post'>";

// 		structuredPost += "<div class='large-3 large-offset-2 small-6 columns'>";
// 		var postImg = "<img src='" + posts[i].url + "b.jpg' class='left'>";
// 		structuredPost += postImg + "</div>";

// 		structuredPost += "<div class='large-4 small-6 columns left'>";
// 		var postTitle = "<span class='caption'>" + posts[i].title + "</span>";
// 		structuredPost += postTitle + "</div>";

// 		structuredPost += "</div>";

// 		$postDisplay.append(structuredPost);
// 		structuredPost = "";
// 	}
// }

function getCheckedBoxes(chkboxName) {
	var checkboxes = document.getElementsByName(chkboxName);
	var checkboxesChecked = [];
	// loop over them all
	for (var i=0; i<checkboxes.length; i++) {
	// And stick the checked ones onto an array...
		if (checkboxes[i].checked) {
			checkboxesChecked.push(checkboxes[i]);
		}
	}
	// Return the array if it is non-empty, or null
	return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}
