require('browser-env')({ url: 'https://example.com' });

// Initialize test-only configuration properties
// These can be set by individual tests as needed for mocking
const config = require('../app/src/js/config');

// Set to a timestamp (in seconds) to mock token expiration for testing
config.mockTokenExpiration = null;

// Set to a timestamp (in ms) to mock session start for testing
config.mockSessionStart = null;
