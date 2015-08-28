var CDR = require('./CDR');
var CDRView = require('./CDRView');
var LoadingView = require('../views/LoadingView');

window.app.on('start', function () {
  this.showCDR = function () {
    var self = this;
    self.cdrs = new CDR();

    self.rootView.main.show(new LoadingView());

    var cdrView = new CDRView({
      collection: self.cdrs
    });
    self.cdrs.fetch().then(function () {
      self.rootView.main.show(cdrView);
    });
  };
});
