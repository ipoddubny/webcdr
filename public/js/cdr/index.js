var CDR = require('./CDR');
var CDRView = require('./CDRView');
var LoadingView = require('../views/LoadingView');

app.addInitializer(function () {
  this.showCDR = function () {
    var self = this;
    self.cdrs = new CDR();

    self.main.show(new LoadingView());

    var cdrView = new CDRView({
      collection: self.cdrs
    });
    self.cdrs.fetch().then(function () {
      self.main.show(cdrView);
    });
  };
});
