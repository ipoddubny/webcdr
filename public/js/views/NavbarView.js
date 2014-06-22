var fs = require('fs');
var tmpl = fs.readFileSync(__dirname + '/../templates/navbar.tmpl', 'utf8');

var ItemView = Marionette.ItemView.extend({
  template: _.template('<a href="#"><%= name %></a>'),
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
  template: _.template(tmpl),
  childView: ItemView,
  childViewContainer: '.js-list',
  className: 'navbar navbar-inverse navbar-fixed-top',
  onChildviewClick: function (view, target) {
    this.collection.each(function (model) {
      model.set('active', false);
    });
    view.model.set('active', true);
    this.trigger('navigate', target);
  }
});

module.exports = NavbarView;
