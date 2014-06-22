var CDR = require('./CDR');
var CDRView = require('./CDRView');

app.addInitializer(function () {
  this.showCDR = function () {
    var self = this;
    self.cdrs = new CDR();

    var cdrView = new CDRView({
      collection: self.cdrs
    });
    self.cdrs.fetch().then(function () {
      self.main.show(cdrView);
    });
  };
});
