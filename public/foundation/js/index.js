'use strict';
$(document).ready(function(){
	OAuth.initialize('XjlzBRnDXCXYM9pRjBIisrXK8Kc');

	$('.apiAuthenticate').click(function(e){
		e.preventDefault();
		$(".close-reveal-modal").click();
		var apiProvider = $(this).find("a").attr('id').replace('auth','');
		add_api(apiProvider);

	});

	$(".collections").click(function(){
		var currentGroup = $(".currentGroup").attr("id");
		$(currentGroup).removeClass("currentGroup");
		$(this).addClass("currentGroup");
		get_content(currentGroup);

	});

});

function get_content(groupName){

}

function select_page_tab(page){
	$(page).addClass("active");
	$(page).find("a").addClass("radius button");
}

function add_api(apiProvider){
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
						provider: apiProvider,
						//	endpoints,
						//	refresh_token,
						groupName: $(".currentGroup").attr("id")
					},
					success: function(data){
						location.href = data;
					}
				});
			});
		}
	});
}

//var apiList = [];
// $(".apiList").click(function(){
// 	var api = $(this).attr("id");
// 	apiList.push(api);
// });