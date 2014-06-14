var fs = require('fs');

var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');

var FilterView = require('./FilterView');

var status2text = {
  'NO ANSWER': 'Не отвечен',
  BUSY: 'Занято',
  ANSWERED: 'Отвечен'
};

var StatusFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    return status2text[raw] || raw;
  }
});

var DateFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    var date = new Date(raw);
    return date.toLocaleString();
  }
});


var columns = [{
  name: 'calldate',
  label: 'Время',
  editable: false,
  cell: 'string',
  formatter: DateFormatter
}, {
  name: 'src',
  label: 'Кто звонил',
  editable: false,
  cell: 'string'
}, {
  name: 'dst',
  label: 'Куда звонил',
  editable: false,
  cell: 'string'
}, {
  name: 'disposition',
  label: 'Статус',
  editable: false,
  cell: 'string',
  formatter: StatusFormatter
}, {
  name: 'billsec',
  label: 'Время разговора',
  editable: false,
  cell: 'string'
}];


var CDRView = Marionette.Layout.extend({
  template: _.template(tmpl),
  regions: {
    filters: '#filters',
    grid: '#grid',
    paginator: '#paginator'
  },
  onShow: function () {
    var gridView = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
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
    this.grid.show(gridView);
    this.paginator.show(paginatorView);
  }
});

module.exports = CDRView;
