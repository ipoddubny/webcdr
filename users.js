var Bookshelf = require('bookshelf').db;

var User = Bookshelf.Model.extend({
  tableName: 'webuser',
  parse: function (attrs) {
    if (attrs.acl.length) {
      attrs.acl = attrs.acl.split(',');
    } else {
      delete attrs.acl;
    }
    attrs.admin = !!attrs.admin;
    return attrs;
  },
  format: function (attrs) {
    if (attrs.acl) {
      attrs.acl = attrs.acl.join(',');
    }
    attrs.admin = +attrs.admin;
    return attrs;
  }
});

var Users = Bookshelf.Collection.extend({
  model: User,
  findByUsername: function (username) {
    return this.query('where', 'username', '=', username).fetch().then(function (users) {
      return users.length ? users.at(0) : null;
    });
  },
  findById: function (id) {
    return this.query('where', 'id', '=', id).fetch().then(function (users) {
      return users.length ? users.at(0) : null;
    });
  }
});

var users = new Users();

module.exports = users;
