const { defineConfig } = require('cypress');
const plugins = require('./cypress/plugins/index');

module.exports = defineConfig({
  env: {
    APIROOT: 'http://localhost:5001',
    authToken: null,
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
      return plugins(on, config);
    },
    baseUrl: 'http://localhost:3000',
  },
});
