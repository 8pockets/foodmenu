function overview(id){
	console.log('Running...');
	var foodtype = id;
	var venues_id =[];
	navigator.geolocation.getCurrentPosition(
		function getvenue(position){
			$("#foursquare").text("loading...");
			var search = 'https://api.foursquare.com/v2/venues/search?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201&ll='+position.coords.latitude+','+position.coords.longitude;

			$.ajax({
				type: 'GET',
				async: false,
				url: search,
				dataType: 'json',
				data:{
					limit:25,
					categoryId:foodtype,
					radius:500
				},
				success: function(data, textStatus, jqXHR){
				$("#foursquare").text("");
				$.each(data.response.venues,function(i){

					venues_id.push(data.response.venues[i].id);
					var venues_name = data.response.venues[i].name;
					var venues_distance = data.response.venues[i].location.distance;
					var venues_count = data.response.venues[i].stats.usersCount;

					$("#foursquare").append(
						$("<div>").addClass(venues_id[i]).append(
							$("<div>").addClass("place-name").append(venues_name)).append(
							$("<div>").addClass("place-distance").append(venues_distance).append("m")).append(
							$("<div>").addClass("place-count").append(venues_count)));
				})//end of each
			},//end of success
			error: function(data, textStatus, jqXHR) {
				$("#foursquare").text("位置情報取得でエラーが発生しました。再度ブラウザを読み込んでください。");
			}
		});//end of ajax

		for(var i=0;i<venues_id.length; i++){
			$.ajax({
				type: 'GET',
				async: false,
				url:'https://api.foursquare.com/v2/venues/'+venues_id[i]+'/photos?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201',
				dataType:'json',
				success: function(data, textStatus, jqXHR){
					if (data.response.photos.count != false){
						var photo = data.response.photos.items[0].suffix;
						var url = 'https://irs0.4sqi.net/img/general/148x148'+photo;	
						$('#foursquare .'+venues_id[i]).prepend(
						$("<div>").addClass("image").append(
						$("<a>").attr("href", 'javascript:void(0)').append(
						$("<img>").attr("src", url))));
					}else{
						return true;
					}//end of if
				},//end of success
				error: function(data, textStatus, jqXHR) {
					$("#foursquare").text("写真取得でエラーが発生しました。再度ブラウザを読み込んでください。");
				}
		});//end of ajax
		}//end of for

		}//end of function getvenue
	);
};