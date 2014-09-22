var moment = require('moment');
var Promise = require('bluebird');
var ExcelExport = require('excel-export');
var Bookshelf = require('bookshelf').db;

var db = require('./db');
var config = require('../config');

var router = require('express').Router();

router.get('/cdrs', function (req, res) {
  console.log('query', req.query);
  var page = parseInt(req.query.page, 10);
  var perPage = parseInt(req.query.per_page, 10);

  var filter = function () {
    this.where(function () {
      if (req.query.number) {
        var like =['%',req.query.number,'%'].join('');
        this.where('src', 'like', like)
            .orWhere('dst', 'like', like);
      } else {
        this.whereRaw('1=1');
      }
    }).andWhere(function () {
      if (req.query.status) {
        this.whereIn('disposition', req.query.status);
      } else {
        this.whereRaw('1=1');
      }
    }).andWhere(function () {
      var tz = config.tz;
      var df = 'YYYY-MM-DD HH:mm:ss'; // mysql format

      var start = req.query.start
        ? moment(req.query.start).zone(tz)
        : moment().zone(tz).startOf('day');

      var end = req.query.end
        ? moment(req.query.end).zone(tz)
        : moment().zone(tz).endOf('day');

      this.whereBetween('calldate', [start.format(df), end.format(df)]);
    }).andWhere(function () {
      if (req.query.direction) {
        this.whereIn('direction',  req.query.direction);
      } else {
        this.whereRaw('1=1');
      }
    }).andWhere(function () {
      if (req.user.acl) {
        this.where(function () {
          this.whereIn('src', req.user.acl);
        }).orWhere(function () {
          this.whereIn('dst', req.user.acl);
        });
        if (req.user.acl_in) {
          this.orWhere(function () {
            this.where('direction', 'in');
          });
        }
      } else {
        this.whereRaw('1=1');
      }
    });
  };

  var countPromise = Bookshelf.knex(db.CDR_TABLE).count('*');
  filter.call(countPromise);

  var dataPromise = db.models.CDR.collection()
    .query(filter)
    .query(function (qb) {
      if (page && perPage) {
        qb.offset((page - 1) * perPage);
        qb.limit(perPage);
      }
      qb.orderBy(req.query.sort_by || 'calldate', req.query.order || 'desc');
    })
    .fetch();

  Promise.all([countPromise, dataPromise]).spread(function (count, collection) {
    var result;
    if (req.query.export === 'xlsx') {
      result = prepareXlsx(collection);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
      res.end(result, 'binary');
      return;
    };
    var cnt = count[0]['count(*)'];
    result = [{total_entries: cnt}, collection.toJSON()];
    res.json(result);
  });
});

function prepareXlsx (collection) {
  var conf = {};
  conf.cols = [{
    caption: 'Дата и время',
    type: 'date',
    beforeCellWrite: function () {
      var originDate = new Date(Date.UTC(1899, 11, 30));
      return function (row, cellData, eOpt) {
        return (cellData - originDate) / (24 * 60 * 60 * 1000);
      };
    }()
  }, {
    caption: 'Кто звонил',
    type: 'string'
  }, {
    caption: 'Куда звонил',
    type: 'string'
  }];
  conf.rows = collection.map(function (model) {
    return [model.get('calldate'), model.get('src'), model.get('dst')];
  });
  return ExcelExport.execute(conf);
}

module.exports = router;
