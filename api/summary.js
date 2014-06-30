var moment = require('moment');
var _ = require('lodash');
var Bookshelf = require('bookshelf').db;
var db = require('./db');

var groups = require('../groups');

var router = require('express').Router();

router.get('/summary', function (req, res) {
  var knex = Bookshelf.knex;

  var querySelect = prepareSummaryQuerySelect(knex);

  var knexTable = knex(db.CDR_TABLE);

  knexTable
    .select.apply(knexTable, querySelect)
    .where('direction', '=', 'in')
    .andWhere(function () {
      this.whereBetween('calldate', [
        req.query.from_date || moment().startOf('day').toJSON(),
        req.query.to_date || moment().endOf('day').toJSON()
      ]);
    })
    .groupBy('day')
    .then(function (data) {
      var result = [];

      var nullData = { calls: 0 };
      _.each(groups, function (group) {
        nullData[group.name] = 0;
      });

      for (var i = 0; i < 7; i++) {
        result[i] = _.extend({ day: i }, nullData);
      }

      _.each(data, function (row) {
        result[row.day] = row;
      });

      res.json(result);
    });
});

function prepareSummaryQuerySelect (knex) {
  var args = _.map(groups, function (group) {
    return knex.raw('SUM(dst BETWEEN ' + group.from + ' AND ' + group.to + ') as ' + group.name);
  });

  args = [
    knex.raw('weekday(calldate) as day'),
    knex.raw('count(*) as calls')
  ].concat(args);

  return args;
}

module.exports = router;
