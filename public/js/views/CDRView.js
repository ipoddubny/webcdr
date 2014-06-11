var fs = require('fs');

var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');

var columns = [{
  name: "id",
  label: "ID",
  editable: false,
  cell: 'integer'
}, {
  name: 'calldate',
  label: 'Время',
  editable: false,
  cell: 'datetime'
}, {
  name: 'src',
  label: 'Кто звонил',
  editable: false,
  cell: 'string'
}, {
  name: 'dst',
  label: 'Куда звонил',
  editable: false,
  cell: 'string'
}, {
  name: 'disposition',
  label: 'Статус',
  editable: false,
  cell: 'string'
}, {
  name: 'billsec',
  label: 'Время разговора',
  editable: false,
  cell: 'string'
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
