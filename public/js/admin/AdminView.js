'use strict';
//var fs = require('fs');
//var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');

var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template('<td><%=username%></td><td><input type="checkbox" <%= admin?"checked":"" %> disabled></td>')
});

var GridView = Marionette.CompositeView.extend({
  tagName: 'table',
  className: 'table',
  template: _.template('<thead><tr><th>Пользователь</th><th>Администратор</th></tr><thead><tbody></tbody>'),
  childView: RowView,
  childViewElement: 'tbody'
});

var AdminView = Marionette.LayoutView.extend({
  className: 'container',
  template: _.template('<div class="grid">'),
  onRender: function () {
    this.$('.grid').html(new GridView({
      collection: this.collection
    }).render().el);
  }
});

module.exports = AdminView;
