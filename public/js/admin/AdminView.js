'use strict';

var _ = require('underscore');
var Marionette = require('marionette');

var fs = require('fs');

var rowTemplate = fs.readFileSync(__dirname + '/row.html', 'utf8');
var tableTemplate = fs.readFileSync(__dirname + '/table.html', 'utf8');

var RowView = Marionette.ItemView.extend({
  tagName: 'tr',
  template: _.template(rowTemplate)
});

var GridView = Marionette.CompositeView.extend({
  tagName: 'table',
  className: 'table',
  template: _.template(tableTemplate),
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
