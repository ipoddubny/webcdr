var fs = require('fs');
var tmpl = fs.readFileSync(__dirname + '/templates/navbar.tmpl', 'utf8');


var ItemView = Marionette.ItemView.extend({
  template: function(opt) {
    console.log(opt);
    return _.template('<a href="#"><%= name %></a>', opt);
  },
  tagName: 'li'
});

var NavbarView = Marionette.CompositeView.extend({
  template: _.template(tmpl),
  itemView: ItemView,
  itemViewContainer: '.js-list',
  className: 'navbar navbar-inverse navbar-fixed-top'
});

module.exports = NavbarView;
