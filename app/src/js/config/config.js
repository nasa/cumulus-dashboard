/**
 * computeBool
 * @description Takes string env variables and converts them to the intended bool value
 * @param {string} value value to convert to boolean
 * @param {boolean || string} defaultValue default value for variable if none provided by user
 * @returns boolean value or default
 */
function computeBool (value, defaultValue) {
  if (!value) return defaultValue;
  if (typeof value !== 'string') return value;
  return value && value.toLowerCase() === 'true';
}

const config = {
  target: process.env.DAAC_NAME || 'local',
  environment: process.env.STAGE || 'development',
  nav: {
    order: ['collections'],
    exclude: {
      PDRs: computeBool(process.env.HIDE_PDR, true),
      Logs: !process.env.KIBANAROOT
    }
  },
  apiRoot: process.env.APIROOT || 'https://example.com',
  awsRegion: process.env.AWS_REGION || 'us-west-2',
  oauthMethod: process.env.AUTH_METHOD || 'earthdata',
  kibanaRoot: process.env.KIBANAROOT || '',
  esRoot: process.env.ESROOT || '',
  esCloudwatchTargetPattern: process.env.ES_CLOUDWATCH_TARGET_PATTERN || '',
  esDistributionTargetPattern: process.env.ES_DISTRIBUTION_TARGET_PATTERN || '',
  showTeaMetrics: computeBool(process.env.SHOW_TEA_METRICS, true),
  showDistributionAPIMetrics: computeBool(process.env.SHOW_DISTRIBUTION_API_METRICS, false),
  graphicsPath: process.env.BUCKET || '',
  enableRecovery: computeBool(process.env.ENABLE_RECOVERY, false),
  esUser: process.env.ES_USER || '',
  esPassword: process.env.ES_PASSWORD || '',
  servedByCumulusAPI: computeBool(process.env.SERVED_BY_CUMULUS_API, '')
};

module.exports = config;
