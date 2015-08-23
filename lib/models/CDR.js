var Bookshelf = require('../db');
var config = require('../config');

var CDR = Bookshelf.Model.extend({
  tableName: config.cdr.table
});

module.exports = CDR;
