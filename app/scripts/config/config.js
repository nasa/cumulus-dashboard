module.exports = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'production',
  nav: {
    order: ['collections'],
    exclude: {
      'pdrs': process.env.HIDE_PDR || true
    }
  },
  apiRoot: 'https://vas1ow86gg.execute-api.us-east-1.amazonaws.com/dev/',
  recoveryPath: 'recover',
  graphicsPath: (process.env.BUCKET || '') + '/graphics/'
};
