var directionsService = new google.maps.DirectionsService();
var directionsDisplay;
var map;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var kansas = new google.maps.LatLng(39.0558, -95.6894);
  var mapOptions = {
    zoom:7,
    center: kansas
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var request = {
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}
;
