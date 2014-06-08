(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var CDR = Backbone.Collection.extend({
  url: '/api/cdrs'
});

module.exports = CDR;

},{}],2:[function(require,module,exports){


var tmpl = "<div class=\"container\">\n\t<div id='grid'>\n\tNo Grid\n\t</div>\n</div>\n";

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

},{}],3:[function(require,module,exports){

var tmpl = "<div class=\"container\">\n\t<div class=\"navbar-header\">\n\t  <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n\t    <span class=\"sr-only\">Toggle navigation</span>\n\t    <span class=\"icon-bar\"></span>\n\t    <span class=\"icon-bar\"></span>\n\t    <span class=\"icon-bar\"></span>\n\t  </button>\n\t  <a class=\"navbar-brand\" href=\"#\">WebCDR</a>\n\t</div>\n\t<div class=\"collapse navbar-collapse\">\n\t  <ul class=\"nav navbar-nav js-list\">\n\t<!--\n\t    <li class=\"active\"><a href=\"#\">Home</a></li>\n\t    <li><a href=\"#about\">About</a></li>\n\t    <li><a href=\"#contact\">Contact</a></li>\n\t-->\n\t  </ul>\n\t</div>\n</div>\n";


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

},{}],4:[function(require,module,exports){

var app = new Backbone.Marionette.Application();
window.app = app;

var MainView = require('./MainView');
var NavbarView = require('./NavbarView');

var CDR = require('./CDR');
app.CDR = CDR;


$(function () {

  app.addRegions({
    navigation: '#navigation',
    main: '#main'
  });

  app.on("initialize:after", function(options){
    if (Backbone.history) {
      Backbone.history.start();
    }
    var cdrs = new CDR();
    cdrs.fetch().then(function () {
      var myView = new MainView({
        collection: cdrs
      });
      app.main.show(myView);
    });

    var navcol = new Backbone.Collection([{
      name: 'App'
    }]);

    var navbar = new NavbarView({
      collection: navcol
    });
    app.navigation.show(navbar);
  });

  app.start();
});

},{"./CDR":1,"./MainView":2,"./NavbarView":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3BvZGR1Ym55L3dlYmNkci9wdWJsaWMvanMvQ0RSLmpzIiwiL2hvbWUvcG9kZHVibnkvd2ViY2RyL3B1YmxpYy9qcy9NYWluVmlldy5qcyIsIi9ob21lL3BvZGR1Ym55L3dlYmNkci9wdWJsaWMvanMvTmF2YmFyVmlldy5qcyIsIi9ob21lL3BvZGR1Ym55L3dlYmNkci9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIENEUiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgdXJsOiAnL2FwaS9jZHJzJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ0RSO1xuIiwiXG5cbnZhciB0bXBsID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcblxcdDxkaXYgaWQ9J2dyaWQnPlxcblxcdE5vIEdyaWRcXG5cXHQ8L2Rpdj5cXG48L2Rpdj5cXG5cIjtcblxudmFyIGNvbHVtbnMgPSBbe1xuICBuYW1lOiBcImlkXCIsXG4gIGxhYmVsOiBcIklEXCIsXG4gIGVkaXRhYmxlOiBmYWxzZSxcbiAgY2VsbDogJ2ludGVnZXInXG59XTtcblxudmFyIE1haW5WaWV3ID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogXy50ZW1wbGF0ZSh0bXBsKSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB0aGlzLmdyaWQgPSBuZXcgQmFja2dyaWQuR3JpZCh7XG4gICAgICBjb2x1bW5zOiBjb2x1bW5zLFxuICAgICAgY29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9uXG4gICAgfSk7XG4gIH0sXG4gIG9uUmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kKCcjZ3JpZCcpLmh0bWwodGhpcy5ncmlkLnJlbmRlcigpLmVsKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFpblZpZXc7XG4iLCJcbnZhciB0bXBsID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250YWluZXJcXFwiPlxcblxcdDxkaXYgY2xhc3M9XFxcIm5hdmJhci1oZWFkZXJcXFwiPlxcblxcdCAgPGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJuYXZiYXItdG9nZ2xlXFxcIiBkYXRhLXRvZ2dsZT1cXFwiY29sbGFwc2VcXFwiIGRhdGEtdGFyZ2V0PVxcXCIubmF2YmFyLWNvbGxhcHNlXFxcIj5cXG5cXHQgICAgPHNwYW4gY2xhc3M9XFxcInNyLW9ubHlcXFwiPlRvZ2dsZSBuYXZpZ2F0aW9uPC9zcGFuPlxcblxcdCAgICA8c3BhbiBjbGFzcz1cXFwiaWNvbi1iYXJcXFwiPjwvc3Bhbj5cXG5cXHQgICAgPHNwYW4gY2xhc3M9XFxcImljb24tYmFyXFxcIj48L3NwYW4+XFxuXFx0ICAgIDxzcGFuIGNsYXNzPVxcXCJpY29uLWJhclxcXCI+PC9zcGFuPlxcblxcdCAgPC9idXR0b24+XFxuXFx0ICA8YSBjbGFzcz1cXFwibmF2YmFyLWJyYW5kXFxcIiBocmVmPVxcXCIjXFxcIj5XZWJDRFI8L2E+XFxuXFx0PC9kaXY+XFxuXFx0PGRpdiBjbGFzcz1cXFwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXFxcIj5cXG5cXHQgIDx1bCBjbGFzcz1cXFwibmF2IG5hdmJhci1uYXYganMtbGlzdFxcXCI+XFxuXFx0PCEtLVxcblxcdCAgICA8bGkgY2xhc3M9XFxcImFjdGl2ZVxcXCI+PGEgaHJlZj1cXFwiI1xcXCI+SG9tZTwvYT48L2xpPlxcblxcdCAgICA8bGk+PGEgaHJlZj1cXFwiI2Fib3V0XFxcIj5BYm91dDwvYT48L2xpPlxcblxcdCAgICA8bGk+PGEgaHJlZj1cXFwiI2NvbnRhY3RcXFwiPkNvbnRhY3Q8L2E+PC9saT5cXG5cXHQtLT5cXG5cXHQgIDwvdWw+XFxuXFx0PC9kaXY+XFxuPC9kaXY+XFxuXCI7XG5cblxudmFyIEl0ZW1WaWV3ID0gTWFyaW9uZXR0ZS5JdGVtVmlldy5leHRlbmQoe1xuICB0ZW1wbGF0ZTogZnVuY3Rpb24ob3B0KSB7XG4gICAgY29uc29sZS5sb2cob3B0KTtcbiAgICByZXR1cm4gXy50ZW1wbGF0ZSgnPGEgaHJlZj1cIiNcIj48JT0gbmFtZSAlPjwvYT4nLCBvcHQpO1xuICB9LFxuICB0YWdOYW1lOiAnbGknXG59KTtcblxudmFyIE5hdmJhclZpZXcgPSBNYXJpb25ldHRlLkNvbXBvc2l0ZVZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IF8udGVtcGxhdGUodG1wbCksXG4gIGl0ZW1WaWV3OiBJdGVtVmlldyxcbiAgaXRlbVZpZXdDb250YWluZXI6ICcuanMtbGlzdCcsXG4gIGNsYXNzTmFtZTogJ25hdmJhciBuYXZiYXItaW52ZXJzZSBuYXZiYXItZml4ZWQtdG9wJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTmF2YmFyVmlldztcbiIsIlxudmFyIGFwcCA9IG5ldyBCYWNrYm9uZS5NYXJpb25ldHRlLkFwcGxpY2F0aW9uKCk7XG53aW5kb3cuYXBwID0gYXBwO1xuXG52YXIgTWFpblZpZXcgPSByZXF1aXJlKCcuL01haW5WaWV3Jyk7XG52YXIgTmF2YmFyVmlldyA9IHJlcXVpcmUoJy4vTmF2YmFyVmlldycpO1xuXG52YXIgQ0RSID0gcmVxdWlyZSgnLi9DRFInKTtcbmFwcC5DRFIgPSBDRFI7XG5cblxuJChmdW5jdGlvbiAoKSB7XG5cbiAgYXBwLmFkZFJlZ2lvbnMoe1xuICAgIG5hdmlnYXRpb246ICcjbmF2aWdhdGlvbicsXG4gICAgbWFpbjogJyNtYWluJ1xuICB9KTtcblxuICBhcHAub24oXCJpbml0aWFsaXplOmFmdGVyXCIsIGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIGlmIChCYWNrYm9uZS5oaXN0b3J5KSB7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG4gICAgfVxuICAgIHZhciBjZHJzID0gbmV3IENEUigpO1xuICAgIGNkcnMuZmV0Y2goKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBteVZpZXcgPSBuZXcgTWFpblZpZXcoe1xuICAgICAgICBjb2xsZWN0aW9uOiBjZHJzXG4gICAgICB9KTtcbiAgICAgIGFwcC5tYWluLnNob3cobXlWaWV3KTtcbiAgICB9KTtcblxuICAgIHZhciBuYXZjb2wgPSBuZXcgQmFja2JvbmUuQ29sbGVjdGlvbihbe1xuICAgICAgbmFtZTogJ0FwcCdcbiAgICB9XSk7XG5cbiAgICB2YXIgbmF2YmFyID0gbmV3IE5hdmJhclZpZXcoe1xuICAgICAgY29sbGVjdGlvbjogbmF2Y29sXG4gICAgfSk7XG4gICAgYXBwLm5hdmlnYXRpb24uc2hvdyhuYXZiYXIpO1xuICB9KTtcblxuICBhcHAuc3RhcnQoKTtcbn0pO1xuIl19
