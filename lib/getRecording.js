'use strict';

const config = require('./config');
const moment = require('moment');
const glob = require('glob');
const _ = require('lodash');

module.exports = function getRecording (cdr, callback) {
  const pattern = config.recordings.pattern;
  const date = moment(cdr.get('calldate'));

  const globString = pattern.replace(/%\w+%/g, w => {
    if (w === '%uniqueid%') {
      return cdr.get('uniqueid');
    }

    return date.format(w.replace(/%/g, ''));
  });

  glob(globString, function (err, files) {
    if (err) {
      callback(err);
      return;
    }

    if (!_.isArray(files) || files.length === 0) {
      callback('not found');
      return;
    }

    callback(null, files[0]);
  });
};

