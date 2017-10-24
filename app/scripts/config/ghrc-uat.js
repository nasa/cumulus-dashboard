'use strict';
var logo = require('./logo');
module.exports = {
  apiRoot: 'https://api.cumulus.ghrc.uat.earthdata.nasa.gov/',
  graphicsPath: '/graphics/',
  environment: 'ghrc-uat',
  requireEarthdataLogin: true,
  consoleMessage: logo
};
