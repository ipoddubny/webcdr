'use strict';

var _ = require('lodash');
var moment = require('moment');
require('moment-timezone');
var Promise = require('bluebird');
var excel4node = require('excel4node');
var Packer = require('zip-stream');
var Bookshelf = require('../db');

var path = require('path');
var fs = require('fs');

var i18n = require('../i18n');

var CDR = require('../models/CDR');
var config = require('../config');

var getRecording = Promise.promisify(require('../getRecording'));

var toLocalTZ, fromLocalTZ;

if (config.tz.match(/^[+-]\d{4}$/)) {
  // utcOffset
  toLocalTZ = m => m.utcOffset(config.tz);
  fromLocalTZ = s => moment(s).utcOffset(config.tz, true);
} else {
  // tz
  if (!moment.tz.zone(config.tz)) {
    console.log(`WebCDR failed to start: incorrect timezone ${config.tz}`);
    process.exit(1);
  }

  toLocalTZ = m => m.tz(config.tz);
  fromLocalTZ = s => moment.tz(s, config.tz);
}

var router = require('express').Router();

router.get('/cdrs', function (req, res) {
  console.log('query', req.query);
  var page = parseInt(req.query.page, 10);
  var perPage = parseInt(req.query.per_page, 10);

  var filter = function () {
    this.where(function () {
      if (req.query.number) {
        var like = ['%', req.query.number, '%'].join('');
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
      var df = 'YYYY-MM-DD HH:mm:ss'; // mysql format

      var start = req.query.start
        ? toLocalTZ(moment(req.query.start))
        : toLocalTZ(moment()).startOf('day');

      var end = req.query.end
        ? toLocalTZ(moment(req.query.end))
        : toLocalTZ(moment()).endOf('day');

      this.whereBetween('calldate', [start.format(df), end.format(df)]);
    }).andWhere(function () {
      if (req.query.direction) {
        var sqlDirection = req.query.direction.map(function (d) {
          switch (d) {
            case 'in': return '(LENGTH(src) > 5 AND LENGTH(dst) <= 5 )';
            case 'out': return '(LENGTH(src) <= 5 AND LENGTH(dst) > 5 )';
            case 'int': return '(LENGTH(src) <= 5 AND LENGTH(dst) <= 5 )';
          }
        }).join(' OR ');
        this.whereRaw(sqlDirection);
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

  var countPromise = Bookshelf.knex(config.cdr.table).select(Bookshelf.knex.raw('COUNT(*) AS cnt'));
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
    if (req.query.export === 'xlsx') {
      prepareXlsx(collection, req.locale).then(function (result) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'Report.xlsx');
        res.end(result, 'binary');
      }).catch(function (err) {
        console.log('CRASH', err);
        res.status(500).send('Failed to create Excel file');
      });
      return;
    }

    if (req.query.export === 'records') {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'records.zip');
      serveRecordsArchive(res, collection);
      return;
    }

    let cnt = count[0]['cnt'];
    let result = [
      {
        total_entries: cnt
      },
      collection.map(model => {
        let obj = model.toJSON();
        obj.id = model.id;
        obj.calldate = fromLocalTZ(obj.calldate).toISOString();
        return obj;
      })
    ];

    res.json(result);
  });
});

function serveRecordsArchive (res, collection) {
  var archive = new Packer({
    store: true // do not try to compress, it's mp3s anyway
  });

  var records = []; // some cdrs use the same record file
  var queue = collection.filter(function (model) {
    var record = model.get('record');
    if (!record) {
      return false;
    }
    if (records.indexOf(record) !== -1) {
      return false;
    }
    records.push(record);
    return true;
  });

  var packFile = function (filename) {
    return new Promise(function (resolve, reject) {
      var fileStream = fs.createReadStream(filename);
      archive.entry(fileStream, {name: path.basename(filename)}, function (err) {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  var chain = _.reduce(queue, function (chain, cdr) {
    return chain.then(function () {
      return getRecording(cdr)
        .then(packFile)
        .catch(function (e) {
          console.log(e, ", but we don't care");
        });
    });
  }, Promise.resolve());

  chain.finally(function () {
    archive.finish();
  });

  archive.pipe(res);
}

function prepareXlsx (collection, locale) {
  const $$ = i18n.getTranslator(locale);

  let wb = new excel4node.Workbook({
    dateFormat: 'm/d/yy hh:mm:ss'
  });
  let ws = wb.addWorksheet('CDR');

  const columns = [{
    header: 'Time',
    field: 'calldate',
    type: 'date',
    width: 20
  }, {
    header: 'Source',
    field: 'src',
    type: 'string',
    width: 17
  }, {
    header: 'Destination',
    field: 'dst',
    type: 'string',
    width: 17
  }, {
    header: 'Dstchannel',
    field: 'dstchannel',
    type: 'string',
    width: 13
  }, {
    header: 'Status',
    field: 'disposition',
    type: 'string',
    width: 13
  }, {
    header: 'Talking time',
    field: 'billsec',
    type: 'time_period',
    width: 13
  }];

  for (let i = 0; i < columns.length; i++) {
    ws.cell(1, i + 1).string($$(columns[i].header)).style({
      font: {bold: true},
      alignment: {horizontal: 'center'}
    });
  }

  const rawCollection = collection.toJSON();
  for (let i = 0; i < rawCollection.length; i++) {
    for (let j = 0; j < columns.length; j++) {
      let cell = ws.cell(2 + i, j + 1);
      switch (columns[j].type) {
        case 'date':
          cell.date(new Date(rawCollection[i][columns[j].field]));
          break;
        case 'string':
          cell.string(rawCollection[i][columns[j].field]);
          break;
        case 'time_period':
          // 0.041666 = 1/24 (showing hours only for really long calls)
          cell.number(Number(rawCollection[i][columns[j].field]) / 86400).style({numberFormat: '[>=0.041666][H]:MM:SS;MM:SS'});
          break;
      }
    }
  }

  for (let i = 0; i < columns.length; i++) {
    ws.column(1 + i).setWidth(columns[i].width);
  }

  return wb.writeToBuffer();
}

module.exports = router;
