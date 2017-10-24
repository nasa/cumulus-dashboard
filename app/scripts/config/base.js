'use strict';
import moment from 'moment';
module.exports = {
  environment: 'development',
  requireEarthdataLogin: true,
  apiRoot: 'https://wjdkfyb6t6.execute-api.us-east-1.amazonaws.com/dev/',

  graphicsPath: '/graphics/',

  // settings for Ace editor
  editorTheme: 'github',
  tabSize: 2,

  // list queries
  pageLimit: 50,

  searchPageLimit: 7,

  // auto-update frequency
  updateInterval: 15000,
  logsUpdateInterval: 10000,

  recent: moment().subtract(1, 'day').format(),

  // delay before UI/store updates after a successful command (ie PUT)
  updateDelay: 1000
};
