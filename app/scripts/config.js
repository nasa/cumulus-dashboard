'use strict';
var defaultsDeep = require('lodash.defaultsdeep');
/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

var configurations = require('./config/*.js', {mode: 'hash'});
var config = configurations.local || {};

if (process.env.DS_ENV === 'staging') {
  defaultsDeep(config, configurations.staging);
}
defaultsDeep(config, configurations.production);

module.exports = config;
