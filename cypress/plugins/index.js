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
import crypto from 'crypto';
import webpack from '@cypress/webpack-preprocessor';
import cypressFailed from 'cypress-failed-log/src/failed';
import { testUtils } from '@cumulus/api';
import { createJwtToken } from '@cumulus/api/lib/token';
import webpackConfig from '../../webpack.config.js';

import { seedEverything } from './seedEverything.js';

process.env.TOKEN_SECRET = crypto.randomBytes(10).toString('hex');

export default function plugin(on) {
  const webpackOptions = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions: webpackConfig,
    watchOptions: {},
  };
  const user = 'testUser';

  // Run specialized file preprocessor to transpile ES6+ -> ES5
  // This fixes compatibility issues with Electron
  on('file:preprocessor', webpack(webpackOptions));

  on('task', {
    resetState () {
      return Promise.all([
        seedEverything(),
        testUtils.setAuthorizedOAuthUsers([user])
      ]).catch((error) => {
        console.log('You possibly have a bad fixture. Check the error below.');
        console.log(JSON.stringify(error, null, 2));
        Promise.reject(error);
      });
    },
    generateJWT (options) {
      return createJwtToken(options);
    },
    log (message) {
      console.log(message);
      return null;
    },
    failed: cypressFailed()
  });
  return plugin();
}

