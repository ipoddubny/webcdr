var config = require('./config');
var knex = require('knex')(config.db);
var db = require('bookshelf')(knex);

module.exports = db;

