'use strict';
import assert from 'assert';

var configurations = require('./config/*.js', {mode: 'hash'});
var config = configurations.base || {};

if (process.env.DS_ENV === 'staging') {
  config = Object.assign({}, config, configurations.staging);
} else if (process.env.DS_ENV === 'production') {
  config = Object.assign({}, config, configurations.production);
}

assert(typeof config.apiRoot, 'string');

module.exports = config;
