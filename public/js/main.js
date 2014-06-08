
var app = new Backbone.Marionette.Application();
window.app = app;

var MainView = require('./MainView');

var CDR = require('./CDR');
app.CDR = CDR;


$(function () {

  app.addRegions({
    navigation: '#navigation',
    main: '#main'
  });

  /*
  app.addInitializer(function () {
    var cdr = new Backbone.Collection([{id:1}, {id:2}]);
    var myView = new MainView({
      collection: cdr
    });
    myView.render();
    app.main.show(myView);
  });
  */

  app.on("initialize:after", function(options){
    if (Backbone.history) {
      Backbone.history.start();
    }
    var cdrs = new CDR();
    cdrs.fetch().then(function () {
      var myView = new MainView({
        collection: cdrs
      });
      app.main.show(myView);
    });
  });

  app.start();
});
