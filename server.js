var express = require('express');
var compress = require('compression');
var app = express();

app.use(compress());
app.use(express.static(__dirname + '/public'));

var collection = [{
  id: 1
}, {
  id: 2
}, {
  id: 3
}];

app.get('/api/cdrs', function (req, res) {
  res.json(collection);
});

app.listen(process.env.PORT || 9030);
