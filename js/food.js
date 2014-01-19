function overview(id){
	console.log('Running...');
	var foodtype = id;
	navigator.geolocation.getCurrentPosition(
		function getvenue(position){
			$("#foursquare").text("loading...");
			var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&ll='+position.coords.latitude+','+position.coords.longitude;
	
			$.ajax({
				type: 'GET',
				async: false,
				url: search,
				dataType: 'json',
				data:{
					limit:40,
					categoryId:foodtype,
					radius:500
				},
				success: function(data, textStatus, jqXHR){
				//取得に成功したらここの処理がはしる。
				$("#foursquare").text("");
				$.each(data.response.groups[0].items,function(i){
	
					var venues_id = data.response.groups[0].items[i].id;
					var venues_name = data.response.groups[0].items[i].name;
					var venues_distance = data.response.groups[0].items[i].location.distance;
					var venues_count = data.response.groups[0].items[i].stats.usersCount;
					
					$("#foursquare").append(
						$("<div>").addClass(venues_id).append(
							$("<div>").addClass("place-name").append(venues_name)).append(
							$("<div>").addClass("place-distance").append(venues_distance).append("m")).append(
							$("<div>").addClass("place-count").append(venues_count)));
	
					$.ajax({
						type: 'GET',
						async: false,
						url:'https://api.foursquare.com/v2/venues/'+venues_id+'/photos?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2',
						dataType:'json',
						success: function(data, textStatus, jqXHR){
						

							var photo = data.response.photos.groups[1].items[0].sizes.items[1].url;
/*
							function photos(venues_id){
								for (i = 0; i < 30; i++){
									var venue_photos = data.response.photos.groups[1].items[i].sizes.items[1].url;
									$("#photos").append(
									$("<div>").addClass("image").append(
									$("<img>").attr("src", venue_photos)));
								}
							};
							.attr("onclick", photos(venues_id))
*/
								
							$('#foursquare .'+venues_id).prepend(
							$("<div>").addClass("image").append(
								$("<a>").attr("href", 'javascript:void(0)').append(
									$("<img>").attr("src", photo))));
						}
					});
				})//end of each
			},//end of success
			error: function(data, textStatus, jqXHR) {
	        	$("#foursquare").text("エラーが発生しました。再度ブラウザを読み込んでください。");
			}
		});
		}
	);
};