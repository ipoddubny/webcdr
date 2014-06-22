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

var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template('<td> <%=getDay(day)%> </td><td> <%=calls%></td>'),
  templateHelpers: {
    getDay: function (day) {
      return days[day];
    }
  }
});

var GridView = Marionette.CompositeView.extend({
  template: _.template('<table class="table"><thead><tr><th class="col-xs-2">День</th><th>Всего звонков</th></tr></thead><tbody></tbody></table>'),
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
