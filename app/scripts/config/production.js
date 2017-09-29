'use strict';
var logo = require('./logo');
module.exports = {
  apiRoot: 'https://cumulus.developmentseed.org/api/',
  requireEarthdataLogin: true,
  graphicsPath: '/dashboard/graphics/',
  environment: 'production',
  consoleMessage: logo
};
