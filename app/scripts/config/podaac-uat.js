'use strict';
var logo = require('./logo');
module.exports = {
  apiRoot: 'https://api.cumulus.podaac.uat.earthdata.nasa.gov/',
  graphicsPath: '/graphics/',
  environment: 'podaac-uat',
  requireEarthdataLogin: true,
  consoleMessage: logo
};
