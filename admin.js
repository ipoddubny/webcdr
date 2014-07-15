var router = require('express').Router();

var users = require('./users');

var _ = require('lodash');

router.get('/users', function (req, res) {
  res.json(users);
});

router.post('/users', function (req, res) {
  var user = req.body;
  var username = user.username;
  if (!username) {
    res.status(422).send({
      errors: [{
        id: 'missing_username',
        field: 'username',
        message: 'Username missing'
      }]
    });
    return;
  }
  if (_.find(users, { username: username })) {
    res.status(409).send({errors: [{
      id: 'username_in_use',
      field: 'username',
      message: 'Username is already taken'
    }]});
    return;
  }
  users.push(user);
  res.send(user);
});

router.put('/users/:username', function (req, res) {
  var user = req.body;
  var username = req.params.username;
  var oldUser = _.find(users, { username: username });
  if (oldUser) {
    _.assign(oldUser, user);
  } else {
    users.push(user);
  }
  res.send(user);
});

router.delete('/users/:username', function (req, res) {
  var user = _.find(users, {username: req.params.username});
  if (user) {
    if (user.username === req.user.username) {
      res.status(409).send('Cannot delete self');
      return;
    }
    users = _.without(users, user);
  }
  res.send([]);
});

module.exports = router;
