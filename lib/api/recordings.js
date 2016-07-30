var moment = require('moment');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

var CDR = require('../models/CDR');
var config = require('../config');

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
    const pattern = config.recordings.pattern;
    const date = moment(cdr.get('calldate'));

    const globString = pattern.replace(/%\w+%/g, w => {
      if (w === '%uniqueid%') {
        return cdr.get('uniqueid');
      }

      return date.format(w.replace(/%/g, ''));
    });

    glob(globString, function (er, files) {
      if (!_.isArray(files) || files.length === 0) {
        res.status(404);
        res.json({error: 'file not found'});
        return;
      }

      const file = files[0];
      const filename = `${date.format('YYYY-MM-DD-HHmm')}_${cdr.get('src')}_${cdr.get('dst')}${path.extname(file)}`;
      res.setHeader('Content-disposition', `attachment; filename=${filename}`);
      res.sendFile(file);
    });
  });
});

module.exports = router;
