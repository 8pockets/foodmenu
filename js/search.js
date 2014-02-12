function form(id){
	var text = location.search.substring(1).split('=');
	var venue_name = decodeURI(text[1]);
	var foodtype = id;

	$.ajax({
		type: 'GET',
		async: true,
		crossDomain: true,
		url:'http://maps.googleapis.com/maps/api/geocode/json?address='+venue_name+'&sensor=false',
		dataType:'json',
		success: function(data, textStatus, jqXHR){
		if (data.results.length == 1){
			var lat = data.results[0].geometry.location.lat;
			var lng = data.results[0].geometry.location.lng;
			getvenue(foodtype, lat, lng);
		}else{
			for(var k=0;k<data.results.length;k++){
				var lat = data.results[k].geometry.location.lat;
				var lng = data.results[k].geometry.location.lng;
				var address = data.results[k].formatted_address;
				$('#anywhere').append(
				$("<div>").addClass("selectplace").append(
				$("<a>").attr("href", 'javascript:void(0)').attr("onclick", "getvenue('4d4b7105d754a06374d81259',"+lat+","+lng+")").attr("data-ajax", 'false').append(address)));
			}
		}
		},//end of success
		error: function(data, textStatus, jqXHR) {
			console.log('取得に失敗');
		}
	});//end of ajax	
}

function getvenue(foodtype, lat, lng){
	
	var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201&ll='+lat+','+lng;
	var venues_id =[];
	
	$("#all").attr({onclick: "getvenue('4d4b7105d754a06374d81259',"+lat+","+lng+")"});
	$("#dining").attr({onclick: "getvenue('4bf58dd8d48988d1c4941735',"+lat+","+lng+")"});
	$("#noodle").attr({onclick: "getvenue('4bf58dd8d48988d1d1941735',"+lat+","+lng+")"});
	$("#cafe").attr({onclick: "getvenue('4bf58dd8d48988d16d941735,4bf58dd8d48988d128941735,4bf58dd8d48988d1dc931735',"+lat+","+lng+")"});
	$("#bar").attr({onclick: "getvenue('4d4b7105d754a06376d81259',"+lat+","+lng+")"});
	
	$.ajax({
		type: 'GET',
		async: true,
		url: search,
		dataType: 'json',
		data:{
			limit:30,
			categoryId:foodtype,
			radius:500
		},
		success: function(data, textStatus, jqXHR){
			$("#foursquare").text("");
			console.log('Get Geolocation');
			$.each(data.response.venues,function(i){

				venues_id.push(data.response.venues[i].id);
				var venues_name = data.response.venues[i].name,
					venues_distance = data.response.venues[i].location.distance,
					venues_count = data.response.venues[i].stats.usersCount;

				var venues_lat = data.response.venues[i].location.lat,
					venues_lng = data.response.venues[i].location.lng,
					venues_address = data.response.venues[i].location.address,
					venues_crossStreet = data.response.venues[i].location.crossStreet;

				$("#foursquare").append(
				$("<div>").addClass(venues_id[i]).append(
				$("<div>").addClass("place-name").append(venues_name)).append(
				$("<div>").addClass("place-distance").append(venues_distance).append("m")).append(
				$("<div>").addClass("place-count").append(venues_count)));

				getphoto(i,venues_id,venues_name,venues_lat,venues_lng);
				$("#anywhere").text("");
			})//end of each
		},//end of success
		error: function(data, textStatus, jqXHR) {
			$("#foursquare").text("位置情報取得でエラーが発生しました。再度ブラウザを読み込んでください。");
		}
	});//end of ajax
}//end of function getvenue


function getphoto(i,venues_id,venues_name,venues_lat,venues_lng){
	$.ajax({
		type: 'GET',
		async: true,
		url:'https://api.foursquare.com/v2/venues/'+venues_id[i]+'/photos?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201',
		dataType:'json',
		success: function(data, textStatus, jqXHR){
			if (data.response.photos.count != false){
				var prefix = data.response.photos.items[0].prefix;
					suffix = data.response.photos.items[0].suffix;
					image = prefix+'148x148'+suffix;
					url = 'info.html?'+venues_id[i]+'&'+venues_name+'&'+venues_lat+'&'+venues_lng;

				$('#foursquare .'+venues_id[i]).prepend(
				$("<div>").addClass("image").append(
				$("<a>").attr("href", url).attr("target", '_blank').append(
				$("<img>").attr("src", image))));
			}else{
				var undefied_photo = 'img/undefiened.png';
				$('#foursquare .'+venues_id[i]).prepend(
				$("<div>").addClass("image").append(
				$("<img>").attr("src", undefied_photo)));
			}//end of if
		},//end of success
		error: function(data, textStatus, jqXHR) {
			$("#foursquare").text("写真取得でエラーが発生しました。再度ブラウザを読み込んでください。");
		}
	});//end of ajax
}
