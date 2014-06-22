//var fs = require('fs');
//var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');

var AdminView = Marionette.ItemView.extend({
  template: _.template('admin interface')
});

module.exports = AdminView;
