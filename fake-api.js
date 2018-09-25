'use strict';

const express = require('express');
const app = express();

/**
 * Config
 */

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    // respond with 200
    res.send(200);
  } else {
  // move on
    next();
  }
});

app.get('/token', (req, res) => {
  const url = req.query.state;
  res.redirect(`${url}?token=fake-token`);
});

app.use('/', express.static('test/fake-api-fixtures', { index: 'index.json' }));

const port = process.env.PORT || 5001;

/**
 * Init
 */
app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
