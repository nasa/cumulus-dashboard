module.exports = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'production',
  nav: {
    order: ['collections'],
    exclude: {
      'pdrs': process.env.HIDE_PDR || true
    }
  },
  apiRoot: process.env.APIROOT || 'https://nvqo63gcfl.execute-api.us-east-1.amazonaws.com/dev',
  graphicsPath: (process.env.BUCKET || '') + '/graphics/'

};
