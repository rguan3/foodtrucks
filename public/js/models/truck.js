var Truck = Backbone.Model.extend({
  urlRoot: "/trucks",

  // Parse food items from string
  foodItems: function() {
    return this.get('fooditems').split(": ");
  }
});
