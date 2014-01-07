'use strict';
$(document).ready(function(){
	OAuth.initialize('XjlzBRnDXCXYM9pRjBIisrXK8Kc');

	$('.apiAuthenticate').click(function(e){
		e.preventDefault();
		$(".close-reveal-modal").click();
		var apiProvider = $(this).find("a").attr('id').replace('auth','');
		add_api(apiProvider);

	});

	function first() {
		//Code for first time click goes here
		var collectionName = $(this).find('label').text();
		get_collection(collectionName, this);
		$(this).one("click", second);
	}
	function second() {
		//Code for second time click goes here
		var nextLabel = $(this).nextUntil('.collections');
		console.log(nextLabel.text());
		nextLabel.remove();
		// $(this).nextUntil(nextLabel,'li').not('.collections').remove();
		$(this).one("click", first);
	}
	$(".collections").one("click", first);

	// $(".collections").toggle(function(){

		// var currentGroup = $(".currentGroup").attr("id");
		// $(currentGroup).removeClass("currentGroup");
		// $(this).addClass("currentGroup");
		// get_collection(currentGroup);

	// });

	$('#new-collection-btn').click(function(){
		var collectionArray = ['github'];
		var collectionName = prompt("Please enter your collection name","First collection");;
		make_new_collection(collectionName, collectionArray)
	});

});

function make_new_collection(collectionName, collectionArray){
	$.ajax({
		method: 'POST',
		url: '/collection',
		data: {
			newCollection: collectionArray,
			collectionName: collectionName
		},
		success: function(data){
			location.href = data;
		}
	});
}

function get_collection(collectionName, that){
	$.ajax({
		method: 'GET',
		url: '/collection',
		data: {
			collectionName: collectionName,
		},
		success: function(data){
			var apiArray = data;
			for( var i = 0; i < data.length; i++ ){
				$(that).after('<li><a href="#">' + data[i].name + '</a></li>');
			}
		}
	});
}

function select_page_tab(page){
	$(page).addClass("active");
	$(page).find("a").addClass("button radius");
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