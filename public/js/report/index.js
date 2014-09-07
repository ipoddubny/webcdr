'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var ReportView = require('./ReportView');

app.addInitializer(function () {
  var self = this;

  var Report = Backbone.Collection.extend({
    url: '/api/summary',
    parse: function (attrs) {
      this.columns = attrs.columns;
      this.rows = attrs.rows;
      _.each(attrs.data, function (row, i) {
        row.unshift(attrs.rows[i]);
      });
      return attrs.data;
    }
  });

  var report = self.report = new Report();

  var filter = new Backbone.Model();

  self.listenTo(filter, 'change', function () {
    report.fetch({
      data: filter.toJSON()
    });
  });

  self.showReport = function () {
    report.fetch().then(function () {
      self.main.show(new ReportView({
        collection: report,
        filter: filter
      }));
    });
  };
});
