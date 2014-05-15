$(function() {
  // Fetch list of food trucks. Only include the data needed to plot them on the map.
  $.get("/trucks?fields=applicant,id,latitude,longitude", function(data) {
    new MapView({locations: data});
  });
});
