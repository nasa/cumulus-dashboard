'use strict';
import assert from 'assert';

var configurations = {
  base: require('./config/base'),
  staging: require('./config/staging'),
  production: require('./config/production'),
  'ghrc-uat': require('./config/ghrc-uat'),
  'lpdaac-sit': require('./config/lpdaac-sit'),
  'lpdaac-uat': require('./config/lpdaac-uat'),
  'nsidc-uat': require('./config/nsidc-uat')
};
var config = configurations.base || {};

if (process.env.DS_ENV === 'staging') {
  config = Object.assign({}, config, configurations.staging);
} else if (process.env.DS_ENV === 'production') {
  config = Object.assign({}, config, configurations.production);
} else if (process.env.DS_ENV === 'ghrc-uat') {
  config = Object.assign({}, config, configurations['ghrc-uat']);
} else if (process.env.DS_ENV === 'lpdaac-sit') {
  config = Object.assign({}, config, configurations['lpdaac-sit']);
} else if (process.env.DS_ENV === 'lpdaac-uat') {
  config = Object.assign({}, config, configurations['lpdaac-uat']);
} else if (process.env.DS_ENV === 'nsidc-uat') {
  config = Object.assign({}, config, configurations['nsidc-uat']);
} else if (process.env.DS_ENV === 'production') {
  config = Object.assign({}, config, configurations.production);
}

// Set the deployment target.
// Allows variable construction of dashboard depending on target,
// including ordering, api root, etc.
const target = (process.env.DS_TARGET || 'cumulus').toLowerCase();
const env = (process.env.DS_ENV || 'development').toLowerCase();

// Set an alternative url to access the Cumulus API from.
const altApiRoot = {
  podaac: 'https://cumulus.ds.io/api/podaac/',
  ghrc: 'https://cumulus.ds.io/api/ghrc/',
  lpdaac: 'https://cumulus.ds.io/api/lpdaac/'
}[target];
if (typeof altApiRoot === 'string') {
  Object.assign(config, { apiRoot: altApiRoot });
}
assert(typeof config.apiRoot, 'string');

if (altApiRoot && env !== 'development') {
  Object.assign(config, { graphicsPath: `/dashboard/${target}/graphics/` });
}

// Determine modules and UI pieces to exclude
const EXCLUDE_NAV_PDRS = { nav: { '/pdrs': true } };
const exclude = {
  podaac: EXCLUDE_NAV_PDRS,
  ghrc: EXCLUDE_NAV_PDRS
}[target] || {};
Object.assign(config, { exclude });

// Determine nav order
const order = {
  podaac: { nav: {
    '/collections': 0
  } }
}[target] || {};
Object.assign(config, { order });

// attach the target to the config
Object.assign(config, { target });
module.exports = config;
