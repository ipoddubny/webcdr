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


var MainView = Marionette.Layout.extend({
  template: _.template(tmpl),
  regions: {
    filters: '#filters',
    grid: '#grid',
    paginator: '#paginator'
  },
  initialize: function (options) {
    this.gridView = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
    });
    this.paginatorView = new Backgrid.Extension.Paginator({
      collection: this.collection
    });
  },
  onShow: function () {
    var filterView = new FilterView();
    this.listenTo(filterView, 'search', function (filter) {
      this.collection.state.currentPage = 1;
      if (filter.number) {
        this.collection.queryParams.filter_number = filter.number;
      }
      if (!_.isUndefined(filter.status)) {
        this.collection.queryParams.status = filter.status;
      }
      if (!_.isUndefined(filter.start)) {
        this.collection.queryParams.start = filter.start;
      }
      if (!_.isUndefined(filter.end)) {
        this.collection.queryParams.end = filter.end;
      }
      this.collection.fetch();
    });
    this.filters.show(filterView);
    this.grid.show(this.gridView);
    this.paginator.show(this.paginatorView);
  }
});

module.exports = MainView;
