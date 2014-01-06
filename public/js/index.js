'use strict';
$(document).ready(function(){

	$('.apiAuthenticate').click(function(e){
		e.preventDefault();
		$(".close-reveal-modal").click();
		var apiProvider = $(this).find("a").attr('id').replace('auth','');

		OAuth.initialize('XjlzBRnDXCXYM9pRjBIisrXK8Kc');

		var csrf_token = '';
		$.ajax({
			method: 'GET',
			url: '/csrf_token',
			success: function(data){
				csrf_token = data.csrf_token;
				OAuth.popup(apiProvider, { 'state' : csrf_token }, function(err, result) {
					if(err) return alert("error: " + error);

					$.ajax({
						method: 'POST',
						url: '/',
						data: {
							token: result.access_token,
							provider: apiProvider
						},
						success: function(data){
							location.href = data;
						}
					});
				});
			}
		});
	});

});

function select_page_tab(page){
	$(page).addClass("active");
	$(page).find("a").addClass("success").addClass("radius").addClass("button");
}

//var apiList = [];
// $(".apiList").click(function(){
// 	var api = $(this).attr("id");
// 	apiList.push(api);
// });