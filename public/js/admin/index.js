'use strict';

var Backbone = require('backbone');

var AdminView = require('./AdminView');

app.addInitializer(function () {
  var self = this;

  var Users = Backbone.Collection.extend({
    url: '/admin/users'
  });

  var users = self.users = new Users();

  self.showAdmin = function () {
    users.fetch().then(function () {
      self.main.show(new AdminView({
        collection: users
      }));
    });
  };
});
