var _ = require('lodash');

var Bookshelf = require('bookshelf');
var knex = Bookshelf.db.knex;

var groups = require('./groups');
var db = require('./api/db');

/*
  {
    rows: [
      '8:30-10:00',
      '10:00-12:00',
      ...
    ],
    columns: [
      'total',
      'service',
      'sales'
    ],
    data: [
      [50, 4, 2],
      [10, 14, 12],
      ...
    ]
  }
*/

var columns = _.map(groups, function (group) {
  return group.name;
});
columns = ['calls'].concat(columns);

function reportWeek (from, to, cb) {
  var querySelect = prepareSummaryQuerySelect(knex);

  var knexTable = knex(db.CDR_TABLE);

  knexTable.select.apply(knexTable, querySelect)
    .where('direction', '=', 'in')
    .andWhere(function () {
      this.whereBetween(knex.raw('date(calldate)'), [from, to]);
    })
    .groupBy('day')
    .then(function (data) {

      var rows = _.times(7, function (i) {
        return 'd'+i;
      });

      var result = _.times(rows.length, function () {
        return _.times(columns.length, function () {
          return 0;
        });
      });

      _.each(data, function (row) {
        _.each(columns, function (column, index) {
          result[row.day][index] = row[column];
        });
      });

      var retd = {
        rows: rows,
        columns: columns,
        data: result
      };

      cb(retd);
    });
}

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

/*****************************************/

var time_periods = [{
  start: '8:30',
  end: '10:00'
}, {
  start: '10:00',
  end: '12:00'
}, {
  start: '12:00',
  end: '15:00'
}, {
  start: '15:00',
  end: '18:00'
}, {
  start: '18:00',
  end: '21:00'
}];


function reportDay(from, to, cb) {
  var args = _.map(groups, function (group) {
    return knex.raw('SUM(dst BETWEEN ' + group.from + ' AND ' + group.to + ') as ' + group.name);
  });
  knex()
    .select([
      'time_id',
      knex.raw('concat(start,"-",end) as timerange'),
      knex.raw('count (id) as calls')
    ].concat(args))
    .from(knex.raw('report_timeperiods tp left join `'+db.CDR_TABLE+'` on time(calldate) between start and end'))
    .where('direction', '=', 'in')
    .andWhere(function () {
      this.whereBetween(knex.raw('date(calldate)'), [from, to]);
    })
    .groupBy(knex.raw('time_id, timerange'))
  .then(function (res) {

    console.log('hello', res);

    var rows = _.map(time_periods, function (tp) {
      return tp.start + '-' + tp.end;
    });
    var data = _.times(rows.length, function () {
      return _.times(columns.length, function () {
        return 0;
      });
    });
    _.each(res, function (row) {
      _.each(columns, function (column, j) {
        data[row.time_id-1][j] = row[column] || 0;
      });
    });
    cb({
      columns: columns,
      rows: rows,
      data: data
    });
  });
}


var reports = {
  week: reportWeek,
  day: reportDay
};

module.exports = function getReport (mode, from, to, cb) {
  return reports[mode](from, to, cb);
};
