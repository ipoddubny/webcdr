var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('marionette');

require('./plugins');

var app = window.app = new Marionette.Application();

var NavbarView = require('./views/NavbarView');

require('./cdr');
require('./report');
require('./admin');

app.addRegions({
  navigation: '#navigation',
  main: '#main'
});

app.addInitializer(function () {

  app.navcol = new Backbone.Collection([{
    name: 'Звонки',
    target: 'cdr',
    active: true
  }, {
    name: 'Входящие',
    target: 'report'
  }]);

  app.navbar = new NavbarView({
    collection: app.navcol
  });
  app.navigation.show(app.navbar);

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

  var controller = {
    'changeTab': function (tab) {
      app.navbar.setActive(tab);
      switch (tab) {
        case 'cdr':
          app.showCDR();
          break;
        case 'report':
          app.showReport();
          break;
        case 'admin':
          app.showAdmin();
          break;
      }
    }
  };

  app.router = new Marionette.AppRouter({
    controller: controller,
    appRoutes: {
      ':tab': 'changeTab'
    }
  });

  this.listenTo(app.navbar, 'navigate', function (target) {
    app.router.navigate(target);
    controller.changeTab(target);
  });
});


app.on("start", function(options){
  if (Backbone.history) {
    Backbone.history.start();
  }

  this.showCDR();
});

app.start();
