'use strict';
import assert from 'assert';

var configurations = {
  base: require('./config/base'),
  staging: require('./config/staging'),
  production: require('./config/production')
};
var config = configurations.base || {};

if (process.env.DS_ENV === 'staging') {
  config = Object.assign({}, config, configurations.staging);
} else if (process.env.DS_ENV === 'production') {
  config = Object.assign({}, config, configurations.production);
}

assert(typeof config.apiRoot, 'string');

// Set the deployment target.
// Allows variable construction of dashboard depending on target.
const target = (process.env.DS_TARGET || 'cumulus').toUpperCase();

// Modules and UI pieces to exclude
const EXCLUDE_NAV_PDRS = { nav: { '/pdrs': true } };
const exclude = {
  PODAAC: EXCLUDE_NAV_PDRS
}[target] || {};

config = Object.assign(config, { exclude });
module.exports = config;
