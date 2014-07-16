'use strict';

var Backbone = require('backbone');

var User = Backbone.Model.extend({
  defaults: {
    name: '',
    username: '',
    password: '',
    admin: false
  },
  urlRoot: '/admin/users/'
});

module.exports = User;
