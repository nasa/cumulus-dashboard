module.exports = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'development',
  nav: {
    order: ['collections'],
    exclude: ['pdrs']
  },
  apiRoot: process.env.APIROOT || 'https://wjdkfyb6t6.execute-api.us-east-1.amazonaws.com/dev/'
};
