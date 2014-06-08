
var app = new Backbone.Marionette.Application();
window.app = app;

var MainView = require('./MainView');
var NavbarView = require('./NavbarView');

var CDR = require('./CDR');
app.CDR = CDR;


$(function () {

  app.addRegions({
    navigation: '#navigation',
    main: '#main'
  });

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

    var navcol = new Backbone.Collection([{
      name: 'Звонки'
    }, {
      name: 'Сводный отчёт'
    }]);

    var navbar = new NavbarView({
      collection: navcol
    });
    app.navigation.show(navbar);
  });

  app.start();
});
