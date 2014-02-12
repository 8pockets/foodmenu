function form(id){
	var text = location.search.substring(1).split('=');
		venue_name = decodeURI(text[1]);
		console.log(venue_name);
	var foodtype = id;
	$.ajax({
		type: 'GET',
		async: true,
		crossDomain: true,
		url:'http://maps.googleapis.com/maps/api/geocode/json?address='+venue_name+'&sensor=false',
		dataType:'json',
		success: function(data, textStatus, jqXHR){
		console.log(data.results[0].geometry.location.lat);
		var lat = data.results[0].geometry.location.lat;
		var lng = data.results[0].geometry.location.lng;
		getvenue(foodtype, lat, lng);
		},//end of success
		error: function(data, textStatus, jqXHR) {
			console.log('取得に失敗');
		}
	});//end of ajax	
}

function getvenue(foodtype, lat, lng){
	var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201&ll='+lat+','+lng;
	var venues_id =[];

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
