moment.lang('ru');

audiojs.events.ready(function() {
  var as = audiojs.createAll();
});

var app = new Backbone.Marionette.Application();
window.app = app;

var CDRView = require('./views/CDRView');
var NavbarView = require('./views/NavbarView');
var LoadingView = require('./views/LoadingView');
var ReportView = require('./views/ReportView');
var AdminView = require('./views/AdminView');

var CDR = require('./CDR');

$(function () {

  app.addRegions({
    navigation: '#navigation',
    main: '#main'
  });

  app.on("initialize:after", function(options){
    if (Backbone.history) {
      Backbone.history.start();
    }

    app.main.show(new LoadingView());

    var cdrs = new CDR();
    app.cdrs = cdrs;

    var cdrView = new CDRView({
      collection: cdrs
    });
    cdrs.fetch().then(function () {
      app.main.show(cdrView);
    });

    var reportView = new ReportView();

    app.navcol = new Backbone.Collection([{
      name: 'Звонки',
      target: 'cdr',
      active: true
    }, {
      name: 'Сводный отчёт',
      target: 'report'
    }]);

    var navbar = new NavbarView({
      collection: app.navcol
    });
    app.navigation.show(navbar);

    var Profile = Backbone.Model.extend({
      url: '/profile'
    });

    app.profile = new Profile();
    app.profile.fetch().then(function () {
      if (app.profile.get('admin')) {
        app.navcol.push({
          name: 'Администрирование',
          target: 'admin'
        });
      }
    });

    navbar.on('navigate', function (target) {
      var views = {
        cdr: cdrView,
        report: reportView,
        admin: new AdminView()
      };
      app.main.show(views[target]);
    });
  });

  app.start();
});
