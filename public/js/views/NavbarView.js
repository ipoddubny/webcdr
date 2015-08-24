'use strict';

var _ = require('underscore');
var Marionette = require('backbone.marionette');

var tmpl = require('../templates/navbar.html');

var ItemView = Marionette.ItemView.extend({
  template: _.template('<a href="#"><i class="fa <%= icon %>"></i>&nbsp;<%= name %></a>'),
  tagName: 'li',
  events: {
    'click a': 'onClick'
  },
  modelEvents: {
    'change': 'render'
  },
  onClick: function (e) {
    e.preventDefault();
    this.trigger('click', this.model.get('target'));
  },
  onRender: function () {
    this.$el.toggleClass('active', this.model.get('active') || false);
  }
});

var NavbarView = Marionette.CompositeView.extend({
  template: tmpl,
  childView: ItemView,
  childViewContainer: '.js-list',
  className: 'navbar navbar-inverse navbar-fixed-top',
  onChildviewClick: function (view, target) {
    this.trigger('navigate', target);
  },
  setActive: function (target) {
    this.collection.each(function (model) {
      model.set('active', model.get('target') === target);
    });
  }
});

module.exports = NavbarView;
