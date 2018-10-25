'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const collectionsJson = require('./test/fake-api-fixtures/collections/index.json');
const providersJson = require('./test/fake-api-fixtures/providers/index.json');

/**
 * Config
 */

function fakeApiMiddleWare (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    // respond with 200
    res.sendStatus(200).end();
    return;
  } else {
    const auth = req.header('Authorization');
    const re = /^\/token/;

    if (auth !== 'Bearer fake-token' && req.url.match(re) === null) {
      res.status(401);
      res.json({
        message: 'Invalid Authorization token'
      }).end();
      return;
    }
  }
  next();
}

const jsonParser = bodyParser.json();

app.use('/', fakeApiMiddleWare);

app.get('/collections', (req, res) => {
  res.send(collectionsJson);
});

app.get('/collections/:name/:version', (req, res) => {
  const collection = collectionsJson.results.filter(
    collection => `${collection.name}${collection.version}` === `${req.params.name}${req.params.version}`
  );
  res.send(collection[0]);
});

app.post('/collections', jsonParser, (req, res) => {
  if (req.body.name) {
    console.log('post collections', req.body);
    collectionsJson.results.push(req.body);
  }
  res.status(200).send({record: req.body, message: 'Record saved'}).end();
});

app.put('/collections/:name/:version', jsonParser, (req, res) => {
  console.log('put collections', req.params, req.body);
  let updated;
  collectionsJson.results.forEach((collection, index) => {
    if (`${collection.name}${collection.version}` === `${req.params.name}${req.params.version}`) {
      collectionsJson.results[index] = req.body;
      updated = collectionsJson.results[index];
    }
  });
  res.status(200).send(updated);
});

app.delete('/collections/:name/:version', (req, res) => {
  collectionsJson.results = collectionsJson.results.filter(
    collection => `${collection.name}${collection.version}` !== `${req.params.name}${req.params.version}`
  );
  res.sendStatus(200).end();
});

app.get('/providers', (req, res) => {
  // console.log(providersJson);
  res.send(providersJson);
});

app.get('/providers/:id', (req, res) => {
  const provider = providersJson.results.filter(
    provider => provider.id === req.params.id
  );
  res.send(provider[0]);
});

app.post('/providers', jsonParser, (req, res) => {
  if (req.body.id) {
    console.log('post providers', req.body);
    providersJson.results.push(req.body);
  }
  res.status(200).send({record: req.body, message: 'Record saved'}).end();
});

app.put('/providers/:id', jsonParser, (req, res) => {
  console.log('put providers', req.params, req.body);
  let updated;
  providersJson.results.forEach((provider, index) => {
    if (provider.id === req.params.id) {
      providersJson.results[index] = Object.assign({}, providersJson.results[index], req.body);
      updated = providersJson.results[index];
    }
  });
  res.status(200).send(updated);
});

app.delete('/providers/:id', (req, res) => {
  providersJson.results = providersJson.results.filter(
    provider => provider.id !== req.params.id
  );
  res.sendStatus(200).end();
});

app.get('/token', (req, res) => {
  const url = req.query.state;
  if (url) {
    res.redirect(`${url}?token=fake-token`);
  } else {
    res.write('state parameter is missing');
    res.status(400).end();
  }
});

app.get('/auth', (req, res) => {
  res.status(200).end();
});

app.use('/', express.static('test/fake-api-fixtures', { index: 'index.json' }));

app.post('/*', (req, res) => {
  res.status(200).send('{"message": "Record saved"}').end();
});

app.put('/*', (req, res) => {
  res.sendStatus(200).end();
});

app.delete('/*', (req, res) => {
  res.sendStatus(200).end();
});

const port = process.env.PORT || 5001;

/**
 * Init
 */
app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
