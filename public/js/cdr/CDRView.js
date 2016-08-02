'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Marionette = require('backbone.marionette');
var moment = require('moment');
var audiojs = require('audiojs');
var Backgrid = require('backgrid');
require('backgrid-paginator');

var tmpl = require('./cdr.html');

var FilterView = require('./FilterView');

var status2text = {
  'NO ANSWER': $$('No answer'),
  BUSY: $$('Busy'),
  ANSWERED: $$('Answered'),
  FAILED: $$('Failed'),
  CONGESTION: $$('Congestion')
};

var StatusFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    return status2text[raw] || raw;
  }
});

var DateFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    return moment(raw).format('DD/MM/YYYY HH:mm:ss');
  }
});

var TimeFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    var minsec = moment.utc(raw * 1000).format('HH:mm:ss');
    var beaux = minsec.replace(/^00:/, '');
    return beaux;
  }
});

Backgrid.AudioCell = Backgrid.StringCell.extend({
  className: 'audio-cell',
  render: function () {
    this.$el.empty();
    var src = URL_PREFIX + '/api/recordings/' + this.model.id;
    if (this.model.get(this.column.get('name'))) {
      this.$el.html('<div class="audiojs-download"><a href="' + src + '" download><span class="glyphicon glyphicon-download"></span></a></div><audio src="' + src + '" preload="none"></audio>');
      audiojs.create(this.$('audio')[0]);
    }
    return this;
  }
});

var columns = [{
  name: 'calldate',
  label: $$('Time'),
  editable: false,
  cell: 'string',
  formatter: DateFormatter
}, {
  name: 'src',
  label: $$('Source'),
  editable: false,
  cell: 'string'
}, {
  name: 'dst',
  label: $$('Destination'),
  editable: false,
  cell: 'string'
}, {
  name: 'disposition',
  label: $$('Status'),
  editable: false,
  cell: 'string',
  formatter: StatusFormatter
}, {
  name: 'billsec',
  label: $$('Talking time'),
  editable: false,
  cell: 'string',
  formatter: TimeFormatter
}, {
  name: 'record',
  label: $$('Recording'),
  editable: false,
  cell: 'audio'
}];

var exportsTemplate = $$('Download') + ':&nbsp; <a data-target="records" href="#"><i class="fa fa-file-audio-o"></i>&nbsp;' + $$('call recordings') + '</a>&nbsp;&nbsp;<a data-target="xlsx" href="#"><i class="fa fa-file-excel-o"></i>&nbsp;' + $$('spreadsheet') + '</a>';
var ExportLinksView = Marionette.ItemView.extend({
  template: _.template(exportsTemplate),
  className: 'pull-right',
  events: {
    'click a': 'onClick'
  },
  onClick: function (e) {
    var self = this;
    e.preventDefault();

    var params = _.pick(self.collection.queryParams, ['start', 'end', 'status', 'number']);
    params.export = $(e.target).data('target');  // xlsx | records
    window.location.assign(URL_PREFIX + '/api/cdrs?' + $.param(params));
  }
});

var CDRView = Marionette.LayoutView.extend({
  template: tmpl,
  regions: {
    filters: '#filters',
    exportLink: '#export',
    grid: '#grid',
    paginator: '#paginator'
  },
  onShow: function () {
    var gridView = new Backgrid.Grid({
      columns: columns,
      collection: this.collection,
      className: 'backgrid backgrid-striped'
    });
    var paginatorView = new Backgrid.Extension.Paginator({
      collection: this.collection
    });
    // TODO attach filter state to collection, and restore filter values
    // in the interface on creating the view
    var filterView = new FilterView();

    this.listenTo(filterView, 'search', function (filter) {
      this.collection.state.currentPage = 1;
      _.extend(this.collection.queryParams, filter);
      this.collection.fetch();
    });

    this.filters.show(filterView);
    this.exportLink.show(new ExportLinksView({
      collection: this.collection
    }));
    this.grid.show(gridView);
    this.paginator.show(paginatorView);
  }
});

module.exports = CDRView;
