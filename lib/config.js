'use strict';

var fs = require('fs');
var ini = require('ini');
var path = require('path');

var config = ini.parse(fs.readFileSync(path.join(__dirname, '/../config.ini'), 'utf-8'));

if (config.web.urlPrefix === undefined) {
  config.web.urlPrefix = '';
}

module.exports = config;
