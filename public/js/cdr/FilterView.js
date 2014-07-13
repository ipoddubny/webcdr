'use strict';

var _ = require('underscore');
var Marionette = require('marionette');
var moment = require('moment');
require('bootstrap-daterangepicker');
require('bootstrap-select');

var fs = require('fs');
var tmplFilter = fs.readFileSync(__dirname + '/filter.html', 'utf8');

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
    'timerange': '#timerange',
    'status': '#status_filter',
    'direction': '#direction_filter',
    'number': '#phone_filter',
    'perpage': '#per_page'
  },
  events: {
    'blur @ui.number': 'onChangeNumber',
    'keyup @ui.number': 'onChangeNumber',
    'change @ui.status': 'onSelectStatus',
    'change @ui.direction': 'onSelectDirection',
    'change @ui.perpage': 'onSelectPerPage'
  },
  filter: {},
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
    this.filter.status = this.ui.status.val();
    this.trigger('search', this.filter);
  },
  onSelectDirection: function () {
    this.filter.direction = this.ui.direction.val();
    this.trigger('search', this.filter);
  },
  onSelectPerPage: function () {
    this.filter.per_page = this.ui.perpage.val();
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

module.exports = FilterView;
