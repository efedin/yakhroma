(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"pict": "images/Red-chair32.png",
		"popupTpl": "<strong>УИК {number}</strong><br/>{obj}. {addr}, тел. {phone}"
	},
	{
		"type": "ТИКи",
		"pict": "images/Red-Couch32.png",
		"popupTpl": "<strong>ТИК <a href='{url}'>{name}</a></strong><br/>{desc}"
	}
];

var getMapYaCentered = function() {
	return (new google.maps.Map(document.getElementById('map'),
	{
		zoom: 12,
		center: new google.maps.LatLng(56.283333, 37.483333),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}));
};
var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
var createMap = function() {
	var map = getMapYaCentered(),
		marker,
		arr,
		infoWindow;

	for (var i = 0, len = ikData.length; i < len; i++) {
		arr = ikData[i].data;
		for (var j = 0, leng = arr.length; j < leng; j++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(arr[j].lat, arr[j].lon),
				map: map,
				title: arr[j].number
			});
			(function(marker, html) {
				infoWindow = new google.maps.InfoWindow();
				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.setContent(html);
					infoWindow.open(map, marker);
				});
			})(marker, tpl(ikData[i].popupTpl, arr[j]));
		}
	}


	var successGetLoc = function(position) {
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successGetLoc);
	}
};
function getHTTPObject() {
	if (typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0"];
		for (var i = 0; i < versions.length; i++) {
			try {
				var oXmlHttp = new ActiveXObject(versions[i]);
				return oXmlHttp;
			} catch (err) {}
		}
	}
}
var xhr = getHTTPObject();
xhr.open("GET", "iks.json", true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200 || xhr.status == 304) {
			var iks = JSON.parse(xhr.responseText);
			ikData[0].data = iks.uiks;
			ikData[1].data = iks.tiks;
			createMap();
		}
	}
};
xhr.send(null);
})();
