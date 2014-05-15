// Backbone view for Google Maps window
var MapView = Backbone.View.extend({
  el: $("#map"),

  initialize: function(options) {
    var locations = options.locations;

    // Set starting map center and zoom level
    var mapOptions = {
      center: new google.maps.LatLng(37.7577, -122.4376),
      zoom: 12
    };
    var map = new google.maps.Map($("#map")[0], mapOptions);

    var infoWindow = new google.maps.InfoWindow();

    // For each location, plot a marker on the map and add a fly-out (InfoWindow)
    // that shows the truck's name when the marker is clicked
    _.each(locations, function(location, index, list) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.latitude, location.longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function (marker, location) {
        return function () {
          // Set truck's name and attach to marker
          infoWindow.setContent(location.applicant);
          infoWindow.open(map, marker);

          // Create truck and truck view
          var truck = new Truck({id: location.id});
          new TruckView({model: truck});
        }
      })(marker, location));
    });

    // Places search box
    var searchBox = new google.maps.places.SearchBox($("#pac-input")[0]);
    var markers = [];

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      // Hide truck view since we have done a new search
      $("#truck-details").addClass("hidden");

      var places = searchBox.getPlaces();

      // Remove old markers from map
      for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
      }

      // For each place, get the icon, place name and location.
      markers = [];
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0, place; place = places[i]; i++) {
        var image = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
          map: map,
          icon: image,
          title: place.name,
          position: place.geometry.location
        });

        // Remember markers so we can remove them during next search
        markers.push(marker);

        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);

      // Zoom in close if user searched for one specific location
      if (markers.length == 1) { map.setZoom(16); }
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function() {
      var bounds = map.getBounds();
      searchBox.setBounds(bounds);
    });
  }
});
