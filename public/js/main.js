
var app = new Backbone.Marionette.Application();

var superView = Marionette.ItemView.extend({
  template: _.template('<div>hello once again</div>'),
});

var mainRegion = Marionette.Region.extend({
  el: '#container'
});

$(function () {

  app.addRegions({
    mainRegion: mainRegion
  });

  app.addInitializer(function () {
    console.log('hello');
    var myView = new superView();
    myView.render();
    console.log(myView.el);
    app.mainRegion.show(myView);
  });

  app.on("initialize:after", function(options){
    if (Backbone.history){
      Backbone.history.start();
    }
  });

  app.start();
});
