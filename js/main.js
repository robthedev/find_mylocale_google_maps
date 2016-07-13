
var myLocale = (function($){
	"use strict";
	//DOM elements
	var $findMeButton = $('.find-me');
	var $findFoodButton = $('.find-food');
	var $clearbutton = $('.clear-results');
	var $cityname = $('.city-name');
	var $rests = $('#restaurants');

	function init () {
		checkForGeo();
		bindEvents();
	}

	function bindEvents () {
		$findMeButton.on("click", showMap);
		$findFoodButton.on("click", showPlaces);
		$clearbutton.on("click", clearResults);
	}
	
	function checkForGeo () {
		
		if (!navigator.geolocation) {
		
			$findMeButton.prop('disabled', 'true');
		} 
	
	}
	
	function getLatLong (position) {

			if (!position) {
				alert('something went wrong...');
				return;
			}

			//Current location.
		    var lat = position.coords.latitude;
		    var lng = position.coords.longitude;
	}

	function getCurrentLocation () {
		//e.preventDefault();
		navigator.geolocation.getCurrentPosition(getLatLong);
	}

	function showLocationName (city, state) {

		if ($cityname.html() === "") {
		 	$cityname.append('<h3>' + city + ", " + state + '</h3>');
		}
	}

	function decodeLatLong (latitude, longitude) {
		var geo_code = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + '%2C' + longitude + '&language=en';

		$.getJSON(geo_code).done(function(location) {
           showLocationName(location.results[0].address_components[2].long_name, location.results[0].address_components[4].long_name);
        }).error(function(xhr, status){
        	alert('decode' + xhr.responseText);
        });
	}


	function showPlaces (latitude, longitude) {

		navigator.geolocation.getCurrentPosition(function(position){

			if (!position) {
				alert('something went wrong...');
				return;
			}

			//Current location.
		    var lat = position.coords.latitude;
		    var lng = position.coords.longitude;

		    decodeLatLong(lat, lng);

		    var places = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=5000&type=meal_takeaway&key=AIzaSyB66TdyoWGHcO0SHUQkXac12svmkq8ggF8';

			$.getJSON(places).done(function(data) {
				for (var i=0; i<5; i++) {
					(function (n) {
						var place = data.results[n];
						$rests.append('<div>' + place.name + ' ' + '<em>(' + place.rating + ')</em>' + '</div>');	
					})(i);
				}
			}).error(function(xhr, status){
				alert('places' + xhr.responseText);
			});

		 });

		$findFoodButton.prop('disabled', 'true');
	}

	function showMap (latitude, longitude) {

		navigator.geolocation.getCurrentPosition(function(position){

			if (!position) {
				alert('something went wrong...');
				return;
			}

			//Current location.
		    var lat = position.coords.latitude;
		    var lng = position.coords.longitude;

		    decodeLatLong(lat, lng);

		   //Uses GMaps library
		var map = new GMaps({
		        el: '#map',
		        lat: lat,
		        lng: lng
		      });

		      map.addMarker({
		        lat: lat,
		        lng: lng
		      });
		 });

		$findMeButton.prop('disabled', 'true');
	}

	function clearResults () {
		location.reload();
	}
  
	return {
		init: init
	};
	
})(jQuery);

myLocale.init();

