var Bookshelf = require('bookshelf').db;
var config = require('../config');

var CDR = Bookshelf.Model.extend({
  tableName: config.cdr.table
});

module.exports = {
  models: {
    CDR: CDR
  }
};
