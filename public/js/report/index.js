'use strict';

var ReportView = require('./ReportView');

app.addInitializer(function () {
  var self = this;

  var Report = Backbone.Collection.extend({
    url: '/api/summary'
  });

  var report = self.report = new Report();

  self.showReport = function () {
    report.fetch().then(function () {
      self.main.show(new ReportView({collection: report}));
    });
  };
});
