const moment = require('moment');

const deploymentConfig = require('./config');

/**
* These are base config values that you can override in your config.js file
**/
const baseConfig = {
  environment: 'development',
  requireEarthdataLogin: false,
  minCompatibleApiVersion: 'change-me-next-api-release',
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
  tokenRefreshThresholdSeconds: 5 * 60, // 5 minutes

  // session duration limit
  maxSessionDurationSeconds: 12 * 60 * 60, // 12 hours

  // session warning threshold - show warning modal when session is within
  // this many seconds of reaching the max session duration
  sessionWarningThresholdSeconds: 20 * 60, // 20 minutes

  // For debugging: set mockTokenExpirationSeconds (in seconds since Unix epoch) to simulate token expiration
  // Set to a time in the future when you want the token to expire
  mockTokenExpirationSeconds: null,

  // For debugging: mock the session start time (in seconds since Unix epoch) for testing
  mockSessionStartSeconds: null,
};

// eslint-disable-next-line prefer-object-spread
const config = Object.assign({}, baseConfig, deploymentConfig);
config.apiRoot = config.apiRoot.replace(/\/?$/, '/');

module.exports = config;
