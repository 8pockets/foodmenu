function overview(id){
	console.log('Running...');
	var foodtype = id;
	var venues_id =[];
	navigator.geolocation.getCurrentPosition(
		function getvenue(position){
			var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201&ll='+position.coords.latitude+','+position.coords.longitude;
			//var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201&ll=35.66596084859448,139.7313094139099';

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
	);
}

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

/*
function btn_active(id){
	if(id = 1){$(".ui-block-a > a").addClass('ui-btn-active');}
	else if(id = 2){$(".ui-block-b > a").addClass('ui-btn-active');}
	else if(id = 3){$(".ui-block-c > a").addClass('ui-btn-active');}
	else if(id = 4){$(".ui-block-d > a").addClass('ui-btn-active');}
	else {$(".ui-block-e > a").addClass('ui-btn-active');}
}
*/