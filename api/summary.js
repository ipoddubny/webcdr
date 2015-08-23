var moment = require('moment');
var _ = require('lodash');
var Bookshelf = require('../db');
var ExcelExport = require('excel-export');

var groups = require('../groups');

var router = require('express').Router();

var getReport = require('../report');

router.get('/summary', function (req, res) {
  var mode = req.query.mode || 'week';
  var from = moment(req.query.from_date) || moment().startOf('day');
  var to = moment(req.query.to_date) || moment().endOf('day');
  var exp = req.query.export;

  getReport(
    mode,
    from.toJSON(),
    to.toJSON(),
    function (report) {
      if (exp === 'xlsx') {
        result = prepareXlsx(report);
        var filename = 'report_' + mode + '_' + from.format('YYYY-MM-DD')  + '.xlsx';
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
        res.end(result, 'binary');
      } else {
        res.json(report);
      }
    }
  );
});

/*
  {
    rows: [
      '8:30-10:00',
      '10:00-12:00',
      ...
    ],
    columns: [
      'calls',
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
function prepareXlsx (report) {
  // TODO need to do something about it
  var translate = function (reqStr) {
    if (reqStr == 'calls') {
      return 'Все';
    }
    var group = _.findWhere(groups, {
      name: reqStr
    });
    if (group) {
      return group.humanName;
    }
    return reqStr;
  };

  // cols ~= ['Период', 'Всего', 'Продажи', 'Сервис'];
  // rows ~= ['08-09',   123,   50, 33];
  var cols = [{
    caption: 'Период',
    type: 'string',
    width: 30
  }];
  _.map(report.columns,  function (name) {
    cols.push({
      caption: translate(name),
      type: 'integer'
    });
  });

  var rows = _.map(report.rows, function (period, i) {
    var res = [];
    res.push(period);
    res = res.concat(report.data[i]);
    return res;
  });
  return ExcelExport.execute({
    cols: cols,
    rows: rows
  });
}

module.exports = router;
