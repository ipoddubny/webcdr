var router = require('express').Router();

var users = require('./users');

router.get('/users', function (req, res) {
  res.json(users);
});

module.exports = router;
