'use strict';

var Backbone = require('backbone');

var CDR = Backbone.PageableCollection.extend({
  url: '/api/cdrs',
  state: {
    pageSize: 20
  }
});

module.exports = CDR;
