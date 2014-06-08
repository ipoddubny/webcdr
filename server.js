var express = require('express');
var app = express();

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
