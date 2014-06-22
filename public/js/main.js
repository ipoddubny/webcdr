require('./plugins');

var app = window.app = new Backbone.Marionette.Application();

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

  app.listenTo(app.navbar, 'navigate', function (target) {
    switch (target) {
      case 'cdr':
        this.showCDR();
        break;
      case 'report':
        this.showReport();
        break;
      case 'admin':
        this.showAdmin();
        break;
    }
  });
});


app.on("start", function(options){
  if (Backbone.history) {
    Backbone.history.start();
  }

  this.showCDR();
});

app.start();
