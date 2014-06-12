var fs = require('fs');

var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');
var tmplFilter = fs.readFileSync(__dirname + '/../templates/filter.tmpl', 'utf8');

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

var columns = [{
  name: 'calldate',
  label: 'Время',
  editable: false,
  cell: 'datetime'
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


var FilterView = Marionette.ItemView.extend({
  template: _.template(tmplFilter),
  ui: {
    'number': 'input.phone'
  },
  events: {
    'blur @ui.number': 'search',
    'keyup @ui.number': 'search'
  },
  search: function () {
    var self = this;

    var newValue = self.ui.number.val();
    if (self.lastValue === newValue) {
      return;
    }

    if (self.timeout) {
      clearTimeout(self.timeout);
    }
    self.lastValue = newValue;
    self.timeout = setTimeout(function () {
      self.trigger('search', newValue);
    }, 300);
  }
});

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
    this.listenTo(filterView, 'search', function (number) {
      this.collection.state.currentPage = 1;
      this.collection.queryParams.filter_number = number;
      this.collection.fetch();
    });
    this.filters.show(filterView);
    this.grid.show(this.gridView);
    this.paginator.show(this.paginatorView);
  }
});

module.exports = MainView;
