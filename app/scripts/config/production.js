'use strict';
var logo = require('./logo');
module.exports = {
  requireEarthdataLogin: true,
  apiRoot: 'https://cumulus.ds.io/api/',
  graphicsPath: '/dashboard/graphics/',
  environment: 'production',
  consoleMessage: logo
};
