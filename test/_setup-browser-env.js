require('browser-env')({ url: 'https://example.com' });

// Initialize test-only configuration properties
// These can be set by individual tests as needed for mocking
const config = require('../app/src/js/config');

// Set to a timestamp (in seconds since Unix epoch) to mock token expiration for testing
config.mockTokenExpirationSeconds = null;

// Set to a timestamp (in seconds since Unix epoch) to mock session start for testing
config.mockSessionStartSeconds = null;
