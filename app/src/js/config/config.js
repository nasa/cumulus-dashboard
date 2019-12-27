module.exports = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'development',
  nav: {
    order: ['collections'],
    exclude: {
      'pdrs': process.env.HIDE_PDR || true
    }
  },
  apiRoot: process.env.APIROOT || 'https://example.com',
  oauthMethod: process.env.AUTH_METHOD || 'earthdata',
  kibanaRoot: process.env.KIBANAROOT || '',
  esRoot: process.env.ESROOT || '',
  showTeaMetrics: process.env.SHOW_TEA_METRICS || true,
  showDistributionAPIMetrics: process.env.SHOW_DISTRIBUTION_API_METRICS || false,
  graphicsPath: (process.env.BUCKET || '') + '/src/assets/images/',
  enableRecovery: process.env.ENABLE_RECOVERY || false
};
