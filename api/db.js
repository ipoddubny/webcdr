var Bookshelf = require('bookshelf').db;

var CDR = Bookshelf.Model.extend({
  tableName: 'cdrview'
});

module.exports = {
  CDR_TABLE: 'cdrview',
  models: {
    CDR: CDR
  }
};
