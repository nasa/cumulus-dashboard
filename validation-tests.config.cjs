const baseConfig = require('./ava.config.cjs');

module.exports = {
  ...baseConfig,
  files: ['**/cypress/validation-tests/**/*'],
};
