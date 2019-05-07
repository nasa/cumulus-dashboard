module.exports = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'production',
  nav: {
    order: ['collections'],
    exclude: {
      'pdrs': process.env.HIDE_PDR || true
    }
  },
  apiRoot: process.env.APIROOT || 'https://example.com',
  graphicsPath: (process.env.BUCKET || '') + '/graphics/',
  recoveryPath: process.env.RECOVERY_PATH || null
};
