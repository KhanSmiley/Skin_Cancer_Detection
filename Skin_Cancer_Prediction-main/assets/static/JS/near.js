// Initialize the map
function initMap() {
  // Check if geolocation is available
  if (navigator.geolocation) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function(position) {
      // Create a LatLng object with the user's current position
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Create a map centered on the user's current position
      var map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 15
      });

      // Create a request object for the nearby search
      var request = {
        location: userLocation,
        radius: '5000', // Specify the search radius in meters (e.g., 5000 meters = 5 kilometers)
        type: 'hospital' // Search for hospitals
      };

      // Perform the nearby search
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Loop through the results and create a marker for each hospital
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      });
    });
  } else {
    // Geolocation is not supported by the browser
    console.log('Geolocation is not supported by this browser.');
  }
}

// Create a marker for a place
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
}
//cards js
function contactMe() {
  window.open('https://www.instagram.com/nisargashoblidar?igsh=OTJ0cGFldzYwb281', '_blank');
}

function contactMe1() {
  window.open('https://www.linkedin.com/in/chandana-m-n-b38041250', '_blank');
}

function contactMe2() {
  window.open('https://www.linkedin.com/in/sameer-ali-khan-208184220', '_blank');
}

function contactMe3() {
  window.open('https://www.linkedin.com/in/rupa-sravya-bandi-5690b9180', '_blank');
}

function contactMe4() {
  window.open('https://www.linkedin.com/in/jabir-rayma-120389195', '_blank');
}

function contactMe5() {
  window.open('https://www.linkedin.com/in/rakshitha-b-322583194', '_blank');
}