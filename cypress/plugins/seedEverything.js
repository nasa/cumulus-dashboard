const { testUtils, serveUtils } = require('@cumulus/api');

const collections = require('../fixtures/seeds/collectionsFixture.json');
const executions = require('../fixtures/seeds/executionsFixture.json');
const granules = require('../fixtures/seeds/granulesFixture.json');
const providers = require('../fixtures/seeds/providersFixture.json');
const rules = require('../fixtures/seeds/rulesFixture.json');

// Test values
const stackName = 'localrun';
const systemBucket = 'localbucket';
const user = 'testUser';

function resetIt() {
  let esClient, esIndex;
  return Promise.all([
    serveUtils.eraseDataStack(stackName, systemBucket)
      .then((values) => {
        esClient = values.esClient;
        esIndex = values.esIndex;
      }),
    testUtils.setAuthorizedOAuthUsers([user])
  ]).then(() => ({esClient, esIndex}));
}

function seedProviders(esClient, esIndex) {
  return serveUtils.addProviders(providers.results, esClient, esIndex);
}

function seedCollections(esClient, esIndex) {
  return serveUtils.addCollections(collections.results, esClient, esIndex);
}

function seedGranules(esClient, esIndex) {
  return serveUtils.addGranules(granules.results, esClient, esIndex);
}

function seedExecutions(esClient, esIndex) {
  return serveUtils.addExecutions(executions.results, esClient, esIndex);
}

function seedRules(esClient, esIndex) {
  return serveUtils.addRules(rules.results, esClient, esIndex);
}

function seedEverything() {
  return resetIt()
    .then(({esClient, esIndex}) =>
          Promise.all([
            seedRules(esClient,esIndex),
            seedCollections(esClient, esIndex),
            seedGranules(esClient, esIndex),
            seedExecutions(esClient, esIndex),
            seedProviders(esClient, esIndex)
          ]));
};

module.exports = {
  seedEverything,
  resetIt
};
