var fs = require('fs');
var ini = require('ini');

config = ini.parse(fs.readFileSync(__dirname + '/../config.ini', 'utf-8'));

module.exports = config;
