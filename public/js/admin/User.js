'use strict';

var Backbone = require('backbone');

var User = Backbone.Model.extend({
  idAttribute: 'username',
  defaults: {
    name: '',
    username: '',
    password: '',
    admin: false
  },
  urlRoot: '/admin/users/'
});

module.exports = User;
