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

// Set the deployment target.
// Allows variable construction of dashboard depending on target,
// including ordering, api root, etc.
const target = (process.env.DS_TARGET || 'cumulus').toUpperCase();

// Set an alternative url to access the Cumulus API from.
const altApiRoot = {
  // PODAAC: '//foo.net/bar'
}[target];
if (typeof altApiRoot === 'string') {
  Object.assign(config, { apiRoot: altApiRoot });
}
assert(typeof config.apiRoot, 'string');

// Determine modules and UI pieces to exclude
const EXCLUDE_NAV_PDRS = { nav: { '/pdrs': true } };
const exclude = {
  PODAAC: EXCLUDE_NAV_PDRS
}[target] || {};
Object.assign(config, { exclude });

// Determine nav order
const order = {
  PODAAC: { nav: {
    '/collections': 0
  } }
}[target] || {};
Object.assign(config, { order });

// Determine the ordering of the header elements

module.exports = config;
