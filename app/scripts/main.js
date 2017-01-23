'use strict';
var config = require('./config');

console.log.apply(console, config.consoleMessage);
console.log('Environment', config.environment);
