const moment = require('moment');

const deploymentConfig = require('./config');

/**
* These are base config values that you can override in your config.js file
**/
const baseConfig = {
  environment: 'development',
  requireEarthdataLogin: false,
  minCompatibleApiVersion: '21.0.0',
  oauthMethod: 'earthdata',

  graphicsPath: '/src/assets/images/',

  // settings for Ace editor
  editorTheme: 'github',
  tabSize: 2,

  // list queries // This is static we need to change this for dynamic table page results
  defaultPageLimit: 50,

  searchPageLimit: 7,
  //

  // auto-update frequency
  updateInterval: 15000,
  logsUpdateInterval: 10000,

  recent: moment().subtract(1, 'day').format(),

  // delay before UI/store updates after a successful command (ie PUT)
  updateDelay: 1000,

  // session duration limit
  maxSessionDuration: 12 * 60 * 60 * 1000, // 12 hours in milliseconds

  // inactivity limits
  inactivityWarningLimit: 15 * 60 * 1000, // 15 minutes in milliseconds
  inactivityLogoutLimit: 20 * 60 * 1000, // 20 minutes in milliseconds
};

// eslint-disable-next-line prefer-object-spread
const config = Object.assign({}, baseConfig, deploymentConfig);
config.apiRoot = config.apiRoot.replace(/\/?$/, '/');

module.exports = config;
