'use strict';

var _ = require('underscore');
var Backbone = require('backbone');
var moment = require('moment');
var ReportView = require('./ReportView');

app.addInitializer(function () {
  var self = this;

  var Report = Backbone.Collection.extend({
    initialize: function (options) {
      this.filter = options.filter;
      this.listenTo(this.filter, 'change', function () {
        this.fetch();
      });
    },
    url: '/api/summary',
    parse: function (attrs) {
      this.columns = attrs.columns;
      this.rows = attrs.rows;
      _.each(attrs.data, function (row, i) {
        row.unshift(attrs.rows[i]);
      });
      return attrs.data;
    },
    fetch: function (options) {
      options = options || {};
      options.data = options.data || {};
      _.extend(options.data, this.filter.toJSON());

      return Backbone.Collection.prototype.fetch.call(this, options);
    }
  });

  var report = self.report = new Report({
    filter: new Backbone.Model({
      mode: 'day',
      from_date: moment().startOf('day').toISOString(),
      to_date: moment().endOf('day').toISOString()
    })
  });

  self.showReport = function () {
    report.fetch().then(function () {
      self.main.show(new ReportView({
        collection: report
      }));
    });
  };
});
