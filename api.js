const TABLE_NAME = 'cdrview';

/****/

var router = require('express').Router();

var path = require('path');
var glob = require('glob');
var Bookshelf = require('bookshelf').db;
var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');
var ExcelExport = require('excel-export');

var CDR = Bookshelf.Model.extend({
  tableName: TABLE_NAME
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
      this.whereBetween('calldate', [
        req.query.start || moment().startOf('day').toJSON(),
        req.query.end || moment().endOf('day').toJSON()
      ]);
    }).andWhere(function () {
      if (req.query.direction) {
        this.where('direction', '=', req.query.direction);
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
      } else {
        this.whereRaw('1=1');
      }
    });
  };

  var countPromise = Bookshelf.knex(TABLE_NAME).count('*');
  filter.call(countPromise);

  var dataPromise = CDR.collection()
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

/*****************/

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
  CDR.forge({id: req.params.id}).fetch().then(function (cdr) {
    var date = moment(cdr.get('calldate'));
    var filepath = path.join('./recordings', ''+date.year(), ''+date.format('MM'), ''+date.format('DD'), '*' + cdr.get('uniqueid') + '.mp3');
    glob(filepath, function (er, files) {
      if (_.isArray(files) && files.length) {
        res.sendfile(files[0]);
      } else {
        res.status(404);
        res.json({error: 'file not found'});
      }
    });
  });
});

/*****************/
var groups = require('./groups');

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

router.get('/summary', function (req, res) {
  var knex = Bookshelf.knex;

  var querySelect = prepareSummaryQuerySelect(knex);

  var knexTable = knex(TABLE_NAME);

  knexTable
    .select.apply(knexTable, querySelect)
    .where('direction', '=', 'in')
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

module.exports = router;
