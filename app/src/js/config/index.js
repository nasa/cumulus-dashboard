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

  // token refresh threshold - refresh token when this many seconds or less remain
  tokenRefreshThreshold: 300, // 5 minutes

  // session duration limit
  maxSessionDuration: 12 * 60 * 60 * 1000, // 12 hours in milliseconds

  // session warning threshold - show warning modal when session is within
  // this many seconds of reaching the max session duration
  sessionWarningThreshold: 20 * 60, // 20 minutes

  // For deugging: set mockTokenExpiration to Unix timestamp (seconds) to simulate token expiration
  // Set to a time in the future when you want the token to expire
  mockTokenExpiration: null,

  // For debugging: mock the session start time so session duration is calculated from "now"
  mockSessionStart: null,

  // inactivity limits
  inactivityWarningLimit: 15 * 60 * 1000, // 15 minutes in milliseconds
  inactivityLogoutLimit: 20 * 60 * 1000, // 20 minutes in milliseconds
};

// eslint-disable-next-line prefer-object-spread
const config = Object.assign({}, baseConfig, deploymentConfig);
config.apiRoot = config.apiRoot.replace(/\/?$/, '/');

module.exports = config;
