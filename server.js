var Promise = require('bluebird');
var moment = require('moment');
var _ = require('lodash');

var ExcelExport = require('excel-export');

var express = require('express');
var compress = require('compression');
var app = express();

app.use(compress());
app.use(express.static(__dirname + '/public'));

var Bookshelf = require('bookshelf');
Bookshelf.db = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '123321',
    database: 'asteriskcdrdb'
  }
});

var CDR = Bookshelf.db.Model.extend({
  tableName: 'cdr'
});

function prepareXlsx (collection) {
  var conf = {};
  conf.cols = [{
    caption: 'Дата и время',
    type: 'date',
    beforeCellWrite: function () {
      var originDate = new Date(Date.UTC(1899, 11, 30));
      return function (row, cellData, eOpt) {
        console.log(cellData, typeof cellData);
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

app.get('/api/cdrs', function (req, res) {
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
    });
  };

  var countPromise = Bookshelf.db.knex('cdr').count('*');
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

app.listen(process.env.PORT || 9030);
