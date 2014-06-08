(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var CDR = Backbone.Collection.extend({
  url: '/api/cdrs'
});

module.exports = CDR;

},{}],2:[function(require,module,exports){


var tmpl = "<div id='grid'>\nNo Grid\n</div>\n";

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

var app = new Backbone.Marionette.Application();
window.app = app;

var MainView = require('./MainView');

var CDR = require('./CDR');
app.CDR = CDR;


$(function () {

  app.addRegions({
    navigation: '#navigation',
    main: '#main'
  });

  /*
  app.addInitializer(function () {
    var cdr = new Backbone.Collection([{id:1}, {id:2}]);
    var myView = new MainView({
      collection: cdr
    });
    myView.render();
    app.main.show(myView);
  });
  */

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
  });

  app.start();
});

},{"./CDR":1,"./MainView":2}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL3BvZGR1Ym55L3dlYmNkci9wdWJsaWMvanMvQ0RSLmpzIiwiL2hvbWUvcG9kZHVibnkvd2ViY2RyL3B1YmxpYy9qcy9NYWluVmlldy5qcyIsIi9ob21lL3BvZGR1Ym55L3dlYmNkci9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxudmFyIENEUiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgdXJsOiAnL2FwaS9jZHJzJ1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ0RSO1xuIiwiXG5cbnZhciB0bXBsID0gXCI8ZGl2IGlkPSdncmlkJz5cXG5ObyBHcmlkXFxuPC9kaXY+XFxuXCI7XG5cbnZhciBjb2x1bW5zID0gW3tcbiAgbmFtZTogXCJpZFwiLFxuICBsYWJlbDogXCJJRFwiLFxuICBlZGl0YWJsZTogZmFsc2UsXG4gIGNlbGw6ICdpbnRlZ2VyJ1xufV07XG5cbnZhciBNYWluVmlldyA9IE1hcmlvbmV0dGUuSXRlbVZpZXcuZXh0ZW5kKHtcbiAgdGVtcGxhdGU6IF8udGVtcGxhdGUodG1wbCksXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdGhpcy5ncmlkID0gbmV3IEJhY2tncmlkLkdyaWQoe1xuICAgICAgY29sdW1uczogY29sdW1ucyxcbiAgICAgIGNvbGxlY3Rpb246IHRoaXMuY29sbGVjdGlvblxuICAgIH0pO1xuICB9LFxuICBvblJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuJCgnI2dyaWQnKS5odG1sKHRoaXMuZ3JpZC5yZW5kZXIoKS5lbCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1haW5WaWV3O1xuIiwiXG52YXIgYXBwID0gbmV3IEJhY2tib25lLk1hcmlvbmV0dGUuQXBwbGljYXRpb24oKTtcbndpbmRvdy5hcHAgPSBhcHA7XG5cbnZhciBNYWluVmlldyA9IHJlcXVpcmUoJy4vTWFpblZpZXcnKTtcblxudmFyIENEUiA9IHJlcXVpcmUoJy4vQ0RSJyk7XG5hcHAuQ0RSID0gQ0RSO1xuXG5cbiQoZnVuY3Rpb24gKCkge1xuXG4gIGFwcC5hZGRSZWdpb25zKHtcbiAgICBuYXZpZ2F0aW9uOiAnI25hdmlnYXRpb24nLFxuICAgIG1haW46ICcjbWFpbidcbiAgfSk7XG5cbiAgLypcbiAgYXBwLmFkZEluaXRpYWxpemVyKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2RyID0gbmV3IEJhY2tib25lLkNvbGxlY3Rpb24oW3tpZDoxfSwge2lkOjJ9XSk7XG4gICAgdmFyIG15VmlldyA9IG5ldyBNYWluVmlldyh7XG4gICAgICBjb2xsZWN0aW9uOiBjZHJcbiAgICB9KTtcbiAgICBteVZpZXcucmVuZGVyKCk7XG4gICAgYXBwLm1haW4uc2hvdyhteVZpZXcpO1xuICB9KTtcbiAgKi9cblxuICBhcHAub24oXCJpbml0aWFsaXplOmFmdGVyXCIsIGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIGlmIChCYWNrYm9uZS5oaXN0b3J5KSB7XG4gICAgICBCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KCk7XG4gICAgfVxuICAgIHZhciBjZHJzID0gbmV3IENEUigpO1xuICAgIGNkcnMuZmV0Y2goKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBteVZpZXcgPSBuZXcgTWFpblZpZXcoe1xuICAgICAgICBjb2xsZWN0aW9uOiBjZHJzXG4gICAgICB9KTtcbiAgICAgIGFwcC5tYWluLnNob3cobXlWaWV3KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgYXBwLnN0YXJ0KCk7XG59KTtcbiJdfQ==
