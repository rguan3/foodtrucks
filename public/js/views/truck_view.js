var TruckView = Backbone.View.extend({
  el: $("#truck-details"),

  initialize: function() {
    _.bindAll(this, "render");
    this.model.fetch({
      success: this.render
    });
  },

  // Compile template from <script /> block
  template: _.template($("#truck-template").html()),

  render: function() {
    // Bind data to template and insert into element
    this.$el.html(this.template({
      applicant: this.model.get("applicant"),
      address: this.model.get("address"),
      foodItems: this.model.foodItems()
    }));

    // Show placeholder now that it isn't empty
    this.$el.removeClass("hidden");

    return this;
  }
});
