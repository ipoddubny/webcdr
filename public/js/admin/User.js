'use strict';

var Backbone = require('backbone');

var User = Backbone.Model.extend({
  defaults: {
    name: '',
    username: '',
    password: '',
    admin: false,
    acl_in: false,
    auth_ad: false
  },
  urlRoot: URL_PREFIX + '/admin/users/'
});

module.exports = User;
