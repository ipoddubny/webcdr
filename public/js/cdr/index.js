var CDR = require('./CDR');
var CDRView = require('./CDRView');
var LoadingView = require('../views/LoadingView');

var $$ = window.$$;

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
    }, function (err) {
      console.log('Failed to load CDRs', err);
      window.app.displayError($$('Failed to load CDRs'));
      self.rootView.main.empty();
    });
  };
});
