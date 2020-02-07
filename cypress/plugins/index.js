// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const browserify = require('@cypress/browserify-preprocessor');

const { testUtils } = require('@cumulus/api');

const { seedEverything } = require('./seedEverything');

const fakeApiToken = require('./token');

module.exports = (on) => {
  const options = browserify.defaultOptions;
  const babelOptions = options.browserifyOptions.transform[1][1];
  const user = 'testUser';
  let esClient;
  let esIndex;
  babelOptions.global = true;
  // ignore all node_modules except files in @cumulus/
  // see https://github.com/cypress-io/cypress-browserify-preprocessor/issues/19
  babelOptions.ignore = [/\/node_modules\/(?!@cumulus\/)/];

  // Run specialized file preprocessor to transpile ES6+ -> ES5
  // This fixes compatibility issues with Electron
  on('file:preprocessor', browserify(options));

  on('task', {
    resetState: function () {
      return Promise.all([
        seedEverything(),
        testUtils.setAuthorizedOAuthUsers([user])
      ]).catch((error) => {
        console.log('You possibly have a bad fixture. Check the error below.');
        console.log(JSON.stringify(error, null, 2));
        Promise.reject(error);
      });
    },
    generateJWT: function (options) {
      return fakeApiToken.generateJWT(options);
    },
    log (message) {
      console.log(message);
      return null;
    },
    failed: require('cypress-failed-log/src/failed')()
  });
};
