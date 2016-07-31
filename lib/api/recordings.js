var path = require('path');
var _ = require('lodash');
var moment = require('moment');

var CDR = require('../models/CDR');
var getRecording = require('../getRecording');

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
  let cdr = CDR.forge();
  cdr.set(cdr.idAttribute, req.params.id);
  cdr.fetch().then(function () {
    const date = moment(cdr.get('calldate'));

    getRecording(cdr, function (err, file) {
      if (err) {
        res.status(404);
        res.json({error: 'file not found'});
        return;
      }

      const filename = `${date.format('YYYY-MM-DD-HHmm')}_${cdr.get('src')}_${cdr.get('dst')}${path.extname(file)}`;
      res.setHeader('Content-disposition', `attachment; filename=${filename}`);
      res.sendFile(file);
    });
  });
});

module.exports = router;
