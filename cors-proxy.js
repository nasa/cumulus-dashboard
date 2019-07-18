// server to proxy CORS requests for tunneled resources
// via localhost port forwarding during development.

// Listen on a specific host via the CPHOST environment variable
var host = process.env.CPHOST || '127.0.0.1';
// Listen on a specific port via the CPPORT environment variable
var port = process.env.CPPORT || 49876;

var corsProxy = require('cors-anywhere');
corsProxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
  })
  .listen(port, host, function () {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
  });
