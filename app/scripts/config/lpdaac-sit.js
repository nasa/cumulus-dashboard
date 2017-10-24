'use strict';
var logo = require('./logo');
module.exports = {
  apiRoot: 'https://api.cumulus.sit.earthdata.nasa.gov/',
  graphicsPath: '/graphics/',
  environment: 'lpdaac-sit',
  requireEarthdataLogin: true,
  consoleMessage: logo
};
