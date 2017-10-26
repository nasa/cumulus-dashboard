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
const apiRoot = process.env.DS_APIROOT;

let config = require('./base');

const yamlFile = fs.readFileSync(path.join(__dirname, '..', 'config.yml'));
const targets = yaml.safeLoad(yamlFile);

if (targets[target]) {
  config = Object.assign({}, config, targets[target]);
}

if (apiRoot) {
  config.apiRoot = apiRoot;
}

assert(typeof config.apiRoot, 'string', 'apiRoot string is required');

if (target !== 'cumulus' && env !== 'development') {
  Object.assign(config, { graphicsPath: `/dashboard/${target}/graphics/` });
}

if (!config.graphicsPath) {
  if (env === 'staging') {
    config.graphicsPath = '/dashboard/dev/graphics/';
  } else if (env === 'production') {
    config.graphicsPath = '/dashboard/graphics/';
  }
}

Object.assign(config, { target });
module.exports = config;
