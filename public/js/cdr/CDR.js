'use strict';

var Backbone = require('backbone');
require('backbone.paginator');

var CDR = Backbone.PageableCollection.extend({
  url: window.URL_PREFIX + '/api/cdrs',
  state: {
    pageSize: 20
  }
});

module.exports = CDR;
