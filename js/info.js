function info(){
	var venue = location.search.substring(1).split('&');
		venue_id = venue[0];
		venue_name = decodeURI(venue[1]);
		venue_lat = Number(venue[2]);
		venue_lng = Number(venue[3]);
		
	$('#title').text(venue_name);
	initialize(venue_lat,venue_lng);
	tips(venue_id);
	
	$.ajax({
		type: 'GET',
		async: true,
		url:'https://api.foursquare.com/v2/venues/'+venue_id+'/photos?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&v=20140201',
		dataType:'json',
		success: function(data, textStatus, jqXHR){
			if (data.response.photos.count != false){
				$("#foursquare").text("");
				for (var i=0; i<data.response.photos.items.length; i++){
					var prefix = data.response.photos.items[i].prefix;
						suffix = data.response.photos.items[i].suffix;
						image = prefix+'148x148'+suffix;
					$('#foursquare').append(
					$("<div>").addClass("image").append(
					$("<img>").attr("src", image)));
				}
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

function initialize(venue_lat,venue_lng){
	var latlng = new google.maps.LatLng(venue_lat, venue_lng);
	var myOptions = {
		zoom: 17,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: 'fooodly'
	});
}

function tips(venue_id){
	$.ajax({
		type: 'GET',
		async: true,
		url:'https://api.foursquare.com/v2/venues/'+venue_id+'/tips?client_id=YFVDPCILKUGXBIPYONW1YQCNF1GOXTUUD3QR2MEUZITSDO50&client_secret=UTCBXKMCHNO2VHY5AABMD4TZ53EBB5GG0H1BLDXENO1GERM2&&v=20140201',
		dataType:'json',
		success: function(data, textStatus, jqXHR){
			if (data.response.tips.count != false){
				for (var i=0; i<data.response.tips.items.length; i++){
					var tip = data.response.tips.items[i].text;
					$(".expandee").append(
					$("<div>").addClass("target").text(tip));
				}
				$('.list').expanderPro({
					expandItem: "expandee",     // Item class
					triggerClass: "trigger",    // Trigger class
					targetClass: "target",      // Target class
					expandedClass: "expanded",  // Expanded class
					hoverClass: "over",         // If not null, will add class on hover
					animSpeed: 200,             // Animation speed in milliseconds
					hideTrigger: false,         // If true, will hide trigger on select
					closeOthers: false,         // If true, will close other elements than selected,
					startExpanded: false,       // If true, target will start expanded
					preventClosing: false,      // If true, expanded item will not close on trigger
					openFirst: false            // If true, first item will open at init
				});
			}else{
				$('.expandee').text('');
			}//end of if
		},//end of success
		error: function(data, textStatus, jqXHR) {
			$("#foursquare").text("写真取得でエラーが発生しました。再度ブラウザを読み込んでください。");
		}
	});//end of ajax
}