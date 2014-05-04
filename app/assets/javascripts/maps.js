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
  //directionsDisplay.setPanel(document.getElementById('directions-panel'));

  /* wtf */
  var control = document.getElementById('block');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}

function calcRoute() {
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;
  var routes;
  var request = {
      origin:start,
      destination:end,
      provideRouteAlternatives:true,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      routes = getRoutes(response);
      var optimalRoute = getBestRoute(routes);
      showBestRoute(routes, optimalRoute);
    }
  });
}

function getRoutes(inResponse) {
  var numRoutes = inResponse['routes'].length;
  var routes = [];

  for (var i = 0; i < numRoutes; i++) {
    var steps = inResponse['routes'][i]['legs'][0]['steps'].length;
    routes[i] = {};
    routes[i]['summary'] = inResponse['routes'][i].summary;
    routes[i]['duration'] = inResponse['routes'][i]['legs'][0]['duration'].text;
    routes[i]['time'] = inResponse['routes'][i]['legs'][0]['duration'].value;
    routes[i]['steps'] = [];
    for (var j = 0; j < steps; j++) {
      routes[i]['steps'].push(inResponse['routes'][i]['legs'][0]['steps'][j].instructions);
    }
  }

  return routes;
}

function getBestRoute(inRoutes) {
  var bestTime;
  var route;
  
  for (var i = 0; i < inRoutes.length; i++) {
    var time = inRoutes[i].time;
    if (typeof bestTime !== 'undefined') {
      if (time < bestTime) {
        bestTime = time;
        route = i;
      }
    } else {
      bestTime = time;
      route = i;
    }
  }

  return route;
}

function showBestRoute(routes, best) {
  var eta = routes[best].duration;
  var route = routes[best].summary;

  $('#route').append("You should take " + route);
  $('#eta').append("Your commute should last " + eta + ".");
}

function forEachStepInRoute(array, action) {
  for (var j = 0; j < array['0'].length; j++) {
    action(array[0][j]);
  }
}

google.maps.event.addDomListener(window, 'load', initialize);