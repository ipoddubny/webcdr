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

var ToolbarView = Marionette.ItemView.extend({
  template: _.template('<div class="btn btn-default js-add"><span class="glyphicon glyphicon-plus"></span> Добавить</div>')
});

var AdminView = Marionette.LayoutView.extend({
  className: 'container',
  template: _.template('<div class="toolbar"></div><div class="grid"></div>'),
  regions: {
    toolbar: '.toolbar',
    grid: '.grid'
  },
  onRender: function () {
    this.toolbar.show(new ToolbarView());
    this.grid.show(new GridView({
      collection: this.collection
    }));
  }
});

module.exports = AdminView;
