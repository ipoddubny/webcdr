var router = require('express').Router();

var users = require('./users');

var bcrypt = require('bcryptjs');

router.get('/users', function (req, res) {
  users.fetch().then(function () {
    res.json(users.toJSON());
  });
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
  user.password = bcrypt.hashSync(user.password, 10);
  users.findByUsername(username).then(function (oldUser) {
    if (oldUser) {
      res.status(409).send({errors: [{
        id: 'username_in_use',
        field: 'username',
        message: 'Username is already taken'
      }]});
    } else {
      users.create(user)
        .then(function(model) {
          res.send(model.toJSON());
        })
        .catch(function(err) {
          console.log(err);
          res.status(500).send('failed to create a user');
        });
    }
  });
});

router.put('/users/:id', function (req, res) {
  var user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  var id = req.params.id;
  users.findById(id).then(function (oldUser) {
    if (oldUser) {
      oldUser.save(user)
        .then(function(model) {
          res.send(model.toJSON());
        })
        .catch(function(err) {
          res.status(500).send('failed changing user');
        });
    } else {
      users.create(user)
        .then(function(model) {
          res.send(model.toJSON());
        })
        .catch(function(err) {
          res.status(500).send('failed to create a user');
        });
    }
  });
});

router.delete('/users/:id', function (req, res) {
  users.findById(req.params.id).then(function (user) {
    if (user) {
      if (user.get('username') === req.user.username) {
        res.status(409).send('Cannot delete self');
        return;
      }
      user.destroy()
        .then(function () {
          res.send([]);
        })
        .catch (function (err) {
          res.status(500).send('failed to delete user');
        });
    } else {
      res.status(404).send('user not found');
    }
  });
});

module.exports = router;
