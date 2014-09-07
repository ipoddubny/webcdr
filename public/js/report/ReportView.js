'use strict';

var _ = require('underscore');
var Marionette = require('marionette');
var fs = require('fs');
var layoutTemplate = fs.readFileSync(__dirname + '/report.html', 'utf8');
var moment = require('moment');

var days = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
];


var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template('<%=getCols()%>'),
  templateHelpers: {
    getCols: function () {
      var res = [];
      _.each(this, function (val, i) {
        if (+i == i) {
          res = res.concat(['<td>', val, '</td>']);
        }
      });
      console.log(res);
      return res.join('');
    }
  }
});


var GridView = Marionette.CompositeView.extend({
  template: _.template('<table class="table"><thead><tr><th class="col-xs-2">Период</th><%=getColumns()%></tr></thead><tbody></tbody></table>'),
  childViewContainer: 'tbody',
  childView: RowView,
  serializeData: function () {
    return {
      columns: this.collection.columns,
      rows: this.collection.rows,
      data: this.collection.data
    };
  },
  templateHelpers: {
    getColumns: function () {
      return _.map(this.columns, function (column) {
        return ['<th>', column, '</th>'].join('');
      }).join('');
    }
  }
});

require('bootstrap-datepicker');
var tmplFilter = fs.readFileSync(__dirname + '/filter.html', 'utf8');
var FiltersView = Marionette.ItemView.extend({
  template: _.template(tmplFilter),
  events: {
    'change .datepicker': 'onChange',
    'hide .datepicker': 'onDateSelected'
  },
  onDateSelected: function () {
    if (this.startDate && this.endDate) {
      var dates = _.map([this.startDate, this.endDate], function (str) {
        return moment(str, 'DD/MM/YYYY').toISOString();
      });
      this.model.set({
        from_date: dates[0],
        to_date: dates[1]
      });
    }
  },
  setInputDate: function (date) {
    var startDate = this.startDate = moment(date).startOf('week');
    var endDate = this.endDate = moment(date).endOf('week');
    var format = 'DD/MM/YYYY';
    this.$('.datepicker').val([startDate.format(format), endDate.format(format)].join(' - '));
  },
  onChange: function () {
    var date = this.$('.datepicker').data('datepicker').dates[0];
    if (date) {
      this.setInputDate(date);
    }
  },
  onRender: function () {
    this.$('.datepicker').datepicker({
      language: 'ru',
      selectWeek: true
    });
  }
});

var ReportView = Marionette.LayoutView.extend({
  template: _.template(layoutTemplate),
  className: 'container',
  regions: {
    filters: '.filters',
    grid: '.grid'
  },
  initialize: function (options) {
    this.filter = options.filter;
  },
  onShow: function () {
    this.filters.show(new FiltersView({
      model: this.filter
    }));
    this.grid.show(new GridView({
      collection: this.collection
    }));
  }
});

module.exports = ReportView;
