'use strict';

var fs = require('fs');
var tmpl = fs.readFileSync(__dirname + '/report.html', 'utf8');

var days = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
];

var groups = require('../../../groups'); // that's really crazy!
var columns = _.reduce(groups, function (memo, group) {
  return memo + ['<td><%=', group.name, '%></td>'].join('');
}, '');

var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template('<td> <%=getDay(day)%> </td><td> <%=calls%></td>' + columns),
  templateHelpers: {
    getDay: function (day) {
      return days[day];
    }
  }
});


var columnNames = _.reduce(groups, function (memo, group) {
  return memo + ['<th>', group.humanName, '</th>'].join('');
}, '');

var GridView = Marionette.CompositeView.extend({
  template: _.template('<table class="table"><thead><tr><th class="col-xs-2">День недели</th><th>Всего звонков</th>' + columnNames + '</tr></thead><tbody></tbody></table>'),
  childViewContainer: 'tbody',
  childView: RowView
});

var ReportView = Marionette.ItemView.extend({
  template: _.template(tmpl),
  className: 'container',
  onRender: function () {
    this.$('.grid').html(new GridView({
      collection: this.collection
    }).render().el);
  }
});

module.exports = ReportView;
