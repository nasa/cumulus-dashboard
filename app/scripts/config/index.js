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

let config = require('./base');

const yamlFile = fs.readFileSync(path.join(__dirname, '..', 'config.yml'));
const targets = yaml.safeLoad(yamlFile);

if (targets[target]) {
  config = Object.assign({}, config, targets[target]);
}

// TODO: are more asserts needed here?
assert(typeof config.apiRoot, 'string', 'apiRoot string is required');

if (target !== 'cumulus' && env !== 'development') {
  Object.assign(config, { graphicsPath: `/dashboard/${target}/graphics/` });
}

Object.assign(config, { target });
module.exports = config;
