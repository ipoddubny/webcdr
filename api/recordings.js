var moment = require('moment');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var db = require('./db');

var router = require('express').Router();

router.param(function (name, fn) {
  if (fn instanceof RegExp) {
    return function(req, res, next, val) {
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});

router.param('id', /^\d+$/);

router.get('/recordings/:id', function (req, res) {
  db.models.CDR.forge({id: req.params.id}).fetch().then(function (cdr) {
    var date = moment(cdr.get('calldate'));
    var filepath = path.join(__dirname + '/../recordings', ''+date.year(), ''+date.format('MM'), ''+date.format('DD'), '*' + cdr.get('uniqueid') + '.mp3');
    glob(filepath, function (er, files) {
      if (_.isArray(files) && files.length) {
        var filename = [date.format('YYYY-MM-DD-HHmm'), cdr.get('src'), cdr.get('dst')].join('_');
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.sendfile(files[0]);
      } else {
        res.status(404);
        res.json({error: 'file not found'});
      }
    });
  });
});

module.exports = router;
