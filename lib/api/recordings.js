var moment = require('moment');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var CDR = require('../models/CDR');

var router = require('express').Router();

router.param('id', function (req, res, next, id) {
  if (id.match(/^\d+$/)) {
    req.params.id = id;
    next();
  } else {
    next('invalid recording id');
  }
});

router.get('/recordings/:id', function (req, res) {
  CDR.forge({id: req.params.id}).fetch().then(function (cdr) {
    var date = moment(cdr.get('calldate'));
    var filepath = path.join(
      __dirname + '/../../recordings',
      '' + date.year(),
      '' + date.format('MM'),
      '' + date.format('DD'),
      '*' + cdr.get('uniqueid') + '.mp3'
    );
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
