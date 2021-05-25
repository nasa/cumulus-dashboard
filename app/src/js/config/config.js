const config = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'development',
  nav: {
    order: ['collections'],
    exclude: {
      PDRs: process.env.HIDE_PDR || true,
      Logs: !process.env.KIBANAROOT
    }
  },
  apiRoot: process.env.APIROOT || 'https://example.com',
  awsRegion: process.env.AWS_REGION || 'us-west-2',
  oauthMethod: process.env.AUTH_METHOD || 'earthdata',
  kibanaRoot: process.env.KIBANAROOT || '',
  kibanaCloudwatchUUID: process.env.KIBANA_CLOUDWATCH_UUID || '',
  kibanaDistributionUUID: process.env.KIBANA_DISTRIBUTION_UUID || '',
  esRoot: process.env.ESROOT || '',
  esCloudwatchIndexPattern: process.env.ES_CLOUDWATCH_INDEX_PATTERN || '',
  esDistributionIndexPattern: process.env.ES_DISTRIBUTION_INDEX_PATTERN || '',
  showTeaMetrics: process.env.SHOW_TEA_METRICS || true,
  showDistributionAPIMetrics: process.env.SHOW_DISTRIBUTION_API_METRICS || false,
  graphicsPath: (process.env.BUCKET || ''),
  enableRecovery: process.env.ENABLE_RECOVERY || false,
  esUser: process.env.ES_USER || '',
  esPassword: process.env.ES_PASSWORD || '',
  servedByCumulusAPI: process.env.SERVED_BY_CUMULUS_API || ''
};

module.exports = config;
