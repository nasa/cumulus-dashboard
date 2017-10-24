'use strict';
var logo = require('./logo');
module.exports = {
  apiRoot: 'https://api.cumulus.nsidc.uat.earthdata.nasa.gov/',
  graphicsPath: '/graphics/',
  environment: 'nsidc-uat',
  requireEarthdataLogin: true,
  consoleMessage: logo
};
