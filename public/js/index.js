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
				method : 'GET',
				url: '/csrf_token',
				success : function(data){
					csrf_token = data.csrf_token;
				}
			});

			// begin access_token requst process from api using oAuth.io module
			OAuth.initialize('XjlzBRnDXCXYM9pRjBIisrXK8Kc');

			// FIXME: replace imgur with generic API provider var
			OAuth.popup('twitter', { 'state' : csrf_token }, function(err, result) {
				if(err) {
					alert("error: " + error);
					return;
				}
				console.log(result.access_token);
			});

		}
	});
});

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