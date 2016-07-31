var Bookshelf = require('../db');
var config = require('../config');

var CDR = Bookshelf.Model.extend({
  tableName: config.cdr.table,
  idAttribute: config.cdr.idAttribute || 'id'
});

module.exports = CDR;
