var fs = require('fs');

var tmpl = fs.readFileSync(__dirname + '/templates/cdr.tmpl', 'utf8');

var columns = [{
  name: "id",
  label: "ID",
  editable: false,
  cell: 'integer'
}];

var MainView = Marionette.ItemView.extend({
  template: _.template(tmpl),
  initialize: function (options) {
    this.grid = new Backgrid.Grid({
      columns: columns,
      collection: this.collection
    });
  },
  onRender: function () {
    this.$('#grid').html(this.grid.render().el);
  }
});

module.exports = MainView;
