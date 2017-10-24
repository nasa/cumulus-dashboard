'use strict';

var path = require('path');
var fs = require('fs');

import assert from 'assert';
import yaml from 'js-yaml';

// Set the deployment target.
// Allows variable construction of dashboard depending on target,
// including ordering, api root, etc.
const target = (process.env.DS_TARGET || 'cumulus').toLowerCase();
const env = (process.env.DS_ENV || 'development').toLowerCase();

var config = require('./config/base');

var yamlFile = fs.readFileSync(path.join(__dirname, 'config.yml'));
var environments = yaml.safeLoad(yamlFile);
console.log('yamlFile', yamlFile)
console.log('environments', environments)
console.log('env', env)
if (environments[env]) {
  config = Object.assign({}, config, environments[env]);
}

// Set an alternative url to access the Cumulus API from.
const altApiRoot = {
  podaac: 'https://cumulus.ds.io/api/podaac/',
  ghrc: 'https://cumulus.ds.io/api/ghrc/',
  lpdaac: 'https://cumulus.ds.io/api/lpdaac/'
}[target];
if (typeof altApiRoot === 'string') {
  Object.assign(config, { apiRoot: altApiRoot });
}

assert(typeof config.apiRoot, 'string', 'apiRoot string is required');

if (target !== 'cumulus' && env !== 'development') {
  Object.assign(config, { graphicsPath: `/dashboard/${target}/graphics/` });
}

config.wut = true
Object.assign(config, { target });
module.exports = config;
