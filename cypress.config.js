const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env: {
    APIROOT: 'http://localhost:5001',
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  viewportWidth: 1300,
  viewportHeight: 1000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
