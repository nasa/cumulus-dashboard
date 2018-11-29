'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');

const {
  fakeCollectionsDb,
  fakeProvidersDb,
  fakeExecutionStatusDb,
  fakeRulesDb,
  resetState
} = require('./test/fake-api/db');

const { generateJWT, verifyJWT } = require('./test/fake-api/token');
let token;

// Reset the fake API state
resetState();

/**
 * Config
 */

function fakeApiMiddleWare (req, res, next) {
  const origin = req.get('origin');

  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Origin');

  // intercepts OPTIONS method
  if (req.method === 'OPTIONS') {
    // respond with 200
    res.sendStatus(200).end();
    return;
  } else {
    const auth = req.header('Authorization');
    const re = /^\/token|refresh/;

    if (req.url.match(re) === null) {
      if (auth !== `Bearer ${token}`) {
        console.log(`auth: ${auth}`);
        console.log(`expected token: ${token}`);
        res.status(401);
        res.json({
          message: 'Invalid Authorization token'
        }).end();
        return;
      }

      try {
        verifyJWT(token);
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          res.status(403);
          res.json({
            message: 'Access token has expired'
          }).end();
          return;
        } else if (err instanceof jwt.JsonWebTokenError) {
          res.status(400);
          res.json({
            message: 'Invalid Authorization token'
          }).end();
          return;
        }
      }
    }
  }
  next();
}

app.use(bodyParser.json());
app.use('/', fakeApiMiddleWare);

app.get('/collections', async (req, res) => {
  const collections = await fakeCollectionsDb.getItems();
  res.send(collections);
});

app.get('/collections/:name/:version', async (req, res) => {
  const collection = await fakeCollectionsDb.getItem(req.params.name, req.params.version);
  res.send(collection);
});

app.post('/collections', async (req, res) => {
  if (req.body.name && req.body.version) {
    await fakeCollectionsDb.addItem(req.body);
  }
  res.status(200).send({record: req.body, message: 'Record saved'}).end();
});

app.put('/collections/:name/:version', async (req, res) => {
  const updatedItem = await fakeCollectionsDb.updateItem(req.params.name, req.params.version, req.body);
  res.status(200).send(updatedItem);
});

app.delete('/collections/:name/:version', async (req, res) => {
  try {
    await fakeCollectionsDb.deleteItem(req.params.name, req.params.version);
    res.sendStatus(200).end();
  } catch (err) {
    res.status(err.code);
    res.json(err).end();
  }
});

app.get('/providers', async (req, res) => {
  const providers = await fakeProvidersDb.getItems();
  res.send(providers);
});

app.get('/providers/:id', async (req, res) => {
  const provider = await fakeProvidersDb.getItem(req.params.id);
  res.send(provider);
});

app.post('/providers', async (req, res) => {
  if (req.body.id) {
    await fakeProvidersDb.addItem(req.body);
  }
  res.status(200).send({record: req.body, message: 'Record saved'}).end();
});

app.put('/providers/:id', async (req, res) => {
  const updatedItem = await fakeProvidersDb.updateItem(req.params.id, req.body);
  res.status(200).send(updatedItem);
});

app.delete('/providers/:id', async (req, res) => {
  try {
    await fakeProvidersDb.deleteItem(req.params.id);
    res.sendStatus(200).end();
  } catch (err) {
    res.status(err.code);
    res.json(err).end();
  }
});

app.get('/rules', async (req, res) => {
  const rules = await fakeRulesDb.getItems();
  res.send(rules);
});

app.get('/rules/:ruleName', async (req, res) => {
  const rule = await fakeRulesDb.getItem(req.params.ruleName);
  res.send(rule);
});

app.post('/rules', async (req, res) => {
  if (req.body.name) {
    await fakeRulesDb.addItem(req.body);
  }
  res.status(200).send({record: req.body, message: 'Record saved'}).end();
});

app.put('/rules/:name', async (req, res) => {
  const updatedItem = await fakeRulesDb.updateItem(req.params.name, req.body);
  res.status(200).send(updatedItem);
});

app.delete('/rules/:name', async (req, res) => {
  await fakeRulesDb.deleteItem(req.params.name);
  res.sendStatus(200).end();
});

app.get('/executions/status/:arn', async (req, res) => {
  const executionStatus = await fakeExecutionStatusDb.getStatus(req.params.arn);
  res.send(executionStatus);
});

app.get('/logs/:executionName', async (req, res) => {
  const executionLogs = await fakeExecutionStatusDb.getLogs(req.params.executionName);
  res.send(executionLogs);
});

app.get('/stats/aggregate', async (req, res, next) => {
  const field = req.query.field;
  const type = req.query.type;
  const statsFile = `test/fake-api/fixtures/stats/aggregate/${type}/index.json`;
  if (field === 'status' && await fs.pathExists(statsFile)) {
    const stats = await fs.readJson(statsFile);
    res.status(200).send(stats);
    return;
  }
  next();
});

app.get('/token', (req, res) => {
  const url = req.query.state;
  if (url) {
    token = generateJWT();
    console.log(`set token: ${token}`);
    res.redirect(`${url}?token=${token}`);
  } else {
    res.write('state parameter is missing');
    res.status(400).end();
  }
});

app.post('/refresh', (req, res) => {
  if (!req.body.token) {
    res.status(400);
    res.json({
      message: 'Missing Authorization token'
    }).end();
    return;
  }
  let requestToken = req.body.token;
  try {
    verifyJWT(requestToken);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(403);
      res.json({
        message: 'Access token expired'
      }).end();
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(403);
      res.json({
        message: 'Invalid access token'
      }).end();
      return;
    }
  }
  token = generateJWT();
  console.log(`refreshed token: ${token}`);
  res.status(200);
  res.json({
    token
  });
});

app.get('/auth', (req, res) => {
  res.status(200).end();
});

app.use('/', express.static('test/fake-api/fixtures', { index: 'index.json' }));

app.put('/*', (req, res) => {
  res.sendStatus(200).end();
});

const port = process.env.PORT || 5001;

/**
 * Init
 */
app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
