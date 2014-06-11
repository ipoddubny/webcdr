
var app = new Backbone.Marionette.Application();
window.app = app;

var CDRView = require('./views/CDRView');
var NavbarView = require('./views/NavbarView');

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
    var cdrView = new CDRView({
      collection: cdrs
    });
    cdrs.fetch().then(function () {
      app.main.show(cdrView);
    });

    var ReportView = Marionette.ItemView.extend({
      template: function() {
        return 'Отчёт';
      }
    });
    var reportView = new ReportView();

    var navcol = new Backbone.Collection([{
      name: 'Звонки',
      target: 'cdr',
      active: true
    }, {
      name: 'Сводный отчёт',
      target: 'report'
    }]);

    var navbar = new NavbarView({
      collection: navcol
    });
    app.navigation.show(navbar);

    navbar.on('navigate', function (target) {
      var views = {
        'cdr': cdrView,
        'report': reportView
      };
      app.main.show(views[target]);
    });
  });

  app.start();
});
