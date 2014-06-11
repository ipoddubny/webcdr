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

var collection = [{
  id: 1
}, {
  id: 2
}, {
  id: 3
}];

app.get('/api/cdrs', function (req, res) {
  CDR.collection().fetch().then(function (collection) {
    res.json(collection);
  });
});

app.listen(process.env.PORT || 9030);
