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


var dateLocale = {
  applyLabel: 'Применить',
  cancelLabel: 'Отмена',
  fromLabel: 'С',
  toLabel: 'По',
  weekLabel: 'W',
  customRangeLabel: 'Выбрать вручную',
  daysOfWeek: moment()._lang._weekdaysMin.slice(),
  monthNames: moment()._lang._monthsShort.slice(),
  firstDay: 1
};

var FilterView = Marionette.ItemView.extend({
  template: _.template(tmplFilter),
  ui: {
    'number': '#phone_filter',
    'status': '#status_filter',
    'timerange': '#timerange'
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
  onSelectDate: function (start, end) {
    this.filter.start = start.toJSON();
    this.filter.end = end.toJSON();
    this.trigger('search', this.filter);
  },
  onRender: function () {
    var self = this;
    this.$('.selectpicker').selectpicker({
      noneSelectedText: 'Все'
    });
    this.ui.timerange.daterangepicker({
      locale: dateLocale,
      timePicker: true,
      timePicker12Hour: false,
      format: 'DD/MM/YYYY HH:mm',
      ranges: {
        'Сегодня': [moment().startOf('day'), moment().endOf('day')],
        'Вчера': [moment(0, 'HH').subtract('days', 1), moment().subtract('days', 1).endOf('day')],
        'Последние 7 дней': [moment(0, 'HH').subtract('days', 6), moment().endOf('day')],
        'Последние 30 дней': [moment(0, 'HH').subtract('days', 29), moment().endOf('day')],
        'Текущий месяц': [moment().startOf('month'), moment().endOf('month')],
        'Прошлый месяц': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')]
      },
      buttonClasses: ['btn', 'btn-sm'],
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day')
    }, function (start, date) {
      self.onSelectDate.apply(self, arguments);
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
