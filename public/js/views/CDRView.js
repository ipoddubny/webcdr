var fs = require('fs');

var tmpl = fs.readFileSync(__dirname + '/../templates/cdr.tmpl', 'utf8');

var status2text = {
  'NO ANSWER': 'Не отвечен',
  BUSY: 'Занято',
  ANSWERED: 'Отвечен'
};
var StatusFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
  fromRaw: function (raw, model) {
    return status2text[raw] || raw;
  }
});

var columns = [{
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
  cell: 'string',
  formatter: StatusFormatter
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
    this.paginator = new Backgrid.Extension.Paginator({
      collection: this.collection
    });
  },
  onRender: function () {
    this.$('#grid').html(this.grid.render().el);
    this.$('#paginator').html(this.paginator.render().el);
  }
});

module.exports = MainView;
