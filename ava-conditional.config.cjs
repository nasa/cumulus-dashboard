const baseConfig = require('./ava.config.cjs');

module.exports = {
  ...baseConfig,
  files: ['test/**/condition*', '!node_modules/', '!test/fixtures/**/*'],
  environmentVariables: {
    HIDE_PDR: 'false',
    KIBANAROOT: 'https://fake.com/linktokibana',
    AUTH_METHOD: 'launchpad',
    ESROOT: 'https://example.com',
    ES_CLOUDWATCH_TARGET_PATTERN: 'fakeESCloudwatchPattern*',
    ES_DISTRIBUTION_TARGET_PATTERN: 'fakeESDistributionPattern*',
    SHOW_DISTRIBUTION_API_METRICS: 'true',
    BUCKET: 'https://example.com/bucket',
    STAGE: 'production',
    DAAC_NAME: 'Cumulus_Daac'
  }
};
