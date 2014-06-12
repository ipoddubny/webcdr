var Promise = require('bluebird');

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

app.get('/api/cdrs', function (req, res) {
  var page = parseInt(req.query.page, 10);
  var perPage = parseInt(req.query.per_page, 10);

  var filter = function () {};

  var countPromise = Bookshelf.db.knex('cdr').count('*');

  var dataPromise = CDR.collection()
    .query(filter)
    .query(function (qb) {
      qb.offset((page - 1) * perPage);
      qb.limit(perPage);
      qb.orderBy(req.query.sort_by || 'calldate', req.query.order || 'desc');
    })
    .fetch();

  Promise.all([countPromise, dataPromise]).spread(function (count, collection) {
    var cnt = count[0]['count(*)'];
    var result = [{total_entries: cnt}, collection.toJSON()];
    res.json(result);
  });
});

app.listen(process.env.PORT || 9030);
