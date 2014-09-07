var moment = require('moment');
var _ = require('lodash');
var Bookshelf = require('bookshelf').db;
var db = require('./db');

var groups = require('../groups');

var router = require('express').Router();

var getReport = require('../report');

router.get('/summary', function (req, res) {
  getReport(
    req.query.mode || 'week',
    req.query.from_date || moment().startOf('day').toJSON(),
    req.query.to_date || moment().endOf('day').toJSON(),
    function (report) {
      res.json(report);
    }
  );
});

module.exports = router;
