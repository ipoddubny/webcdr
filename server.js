var _ = require('lodash');
var express = require('express');
var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var util = require('util');

var config = require('./lib/config');
var Users = require('./lib/models/users');
var users = new Users();

var passport = require('passport');
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  users.query('where', 'id', '=', id)
    .fetch()
    .then(function (col) {
      done(null, col.at(0).toJSON());
    })
    .catch(function (err) {
      done(err);
    });
});
passport.use(require('./lib/auth')(users));

var app = express();
app.use(morgan('dev')); // logger
app.use(compress());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cookieSession({
  secret: config.session.key
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/login', bodyParser.urlencoded({extended: false}));
app.get('/login', function (req, res) {
  res.sendfile(__dirname + '/public/login.html');
});
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.use('/api', ensureAuthenticated);
app.use('/api', require('./lib/api'));

app.get('/', ensureAuthenticated);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/profile', ensureAuthenticated);
app.get('/profile', function (req, res) {
  res.send(_.omit(req.user, 'password'));
});

app.use('/admin', ensureAdmin);
app.use('/admin', require('./lib/admin')(users));

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 9030;
app.listen(port);
util.log('Server is now running on port', port);

function ensureAuthenticated (req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
    next('Failed login attempt');
    return;
  }

  next();
}

function ensureAdmin (req, res, next) {
  ensureAuthenticated(req, res, function () {
    if (!req.user.admin) {
      res.json({error: 'access denied'});
    } else {
      next();
    }
  });
}
