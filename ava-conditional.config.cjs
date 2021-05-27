const baseConfig = require('./ava.config.cjs');

module.exports = {
  ...baseConfig,
  files: ['test/**/condition*', '!node_modules/', '!test/fixtures/**/*'],
  environmentVariables: {
    HIDE_PDR: 'false',
    KIBANAROOT: 'https://fake.com/linktokibana',
    KIBANA_CLOUDWATCH_UUID: 'fakeCloudwatchUUid',
    KIBANA_DISTRIBUTION_UUID: 'fakeDistributionUUID',
    KIBANA_GRANULES_UUID: 'fakeGranulesUUID',
    KIBANA_SECURITY_TENANT: 'FakeSecuritySenant',
    AUTH_METHOD: 'launchpad',
    ESROOT: 'https://example.com',
    ES_CLOUDWATCH_INDEX_PATTERN: 'fakeESCloudwatchPattern*',
    ES_DISTRIBUTION_INDEX_PATTERN: 'fakeESDistributionPattern*',
    SHOW_DISTRIBUTION_API_METRICS: 'true',
    BUCKET: 'https://example.com/bucket',
    STAGE: 'production',
    DAAC_NAME: 'Cumulus_Daac'
  }
};
