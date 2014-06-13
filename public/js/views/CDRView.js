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


var FilterView = Marionette.ItemView.extend({
  template: _.template(tmplFilter),
  ui: {
    'number': '#phone_filter',
    'status': '#status_filter'
  },
  events: {
    'blur @ui.number': 'onChangeNumber',
    'keyup @ui.number': 'onChangeNumber',
    'change @ui.status': 'onSelectStatus'
  },
  initialize: function () {
    this.filter = {};
  },
  onChangeNumber: function () {
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
      self.filter.number = newValue;
      self.trigger('search', self.filter);
    }, 300);
  },
  onSelectStatus: function () {
    this.filter.status = this.ui.status.val();;
    this.trigger('search', this.filter);
  },
  onRender: function () {
    this.$('.selectpicker').selectpicker({
      noneSelectedText: 'Все'
    });
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
    this.listenTo(filterView, 'search', function (filter) {
      this.collection.state.currentPage = 1;
      if (filter.number) {
        this.collection.queryParams.filter_number = filter.number;
      }
      if (!_.isUndefined(filter.status)) {
        this.collection.queryParams.status = filter.status;
      }
      this.collection.fetch();
    });
    this.filters.show(filterView);
    this.grid.show(this.gridView);
    this.paginator.show(this.paginatorView);
  }
});

module.exports = MainView;
