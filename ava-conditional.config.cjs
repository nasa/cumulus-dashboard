const baseConfig = require('./ava.config.cjs');

module.exports = {
  ...baseConfig,
  files: ['test/**/condition*', '!node_modules/', '!test/fixtures/**/*'],
  environmentVariables: {
    HIDE_PDR: 'false',
    KIBANAROOT: 'https://fake.com/linktokibana',
    AUTH_METHOD: 'launchpad',
    BUCKET: 'https://example.com/bucket',
    STAGE: 'production',
    DAAC_NAME: 'Cumulus_Daac'
  }
};
