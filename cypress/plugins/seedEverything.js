const { testUtils } = require('@cumulus/api');
const { promiseS3Upload } = require('@cumulus/aws-client/S3');
const fs = require('fs');
const path = require('path');
const CSV = require('csv-string');
const serveUtils = require('@cumulus/api/bin/serveUtils');
const { eraseDataStack } = require('@cumulus/api/bin/serve');
const {
  localUserName,
  localStackName,
  localSystemBucket,
} = require('@cumulus/api/bin/local-test-defaults');

const collections = require('../fixtures/seeds/collectionsFixture.json');
const executions = require('../fixtures/seeds/executionsFixture.json');
const granules = require('../fixtures/seeds/granulesFixture.json');
const granulesExecutions = require('../fixtures/seeds/granulesExecutionsFixture.json');
const providers = require('../fixtures/seeds/providersFixture.json');
const rules = require('../fixtures/seeds/rulesFixture.json');
const pdrs = require('../fixtures/seeds/pdrsFixture.json');
const reconciliationReports = require('../fixtures/seeds/reconciliationReportFixture.json');
const reconciliationReportDir = path.resolve(__dirname, '../fixtures/seeds/reconciliation-reports');
function resetIt() {
  return Promise.all([
    eraseDataStack(),
    testUtils.setAuthorizedOAuthUsers([localUserName]),
    serveUtils.resetPostgresDb(),
  ]);
}

function seedProviders() {
  return serveUtils.addProviders(providers.results);
}

function seedCollections() {
  return serveUtils.addCollections(collections.results);
}

function seedGranules() {
  return serveUtils.addGranules(granules.results);
}

function seedExecutions() {
  return serveUtils.addExecutions(executions.results);
}

function seedReconciliationReports() {
  return serveUtils.addReconciliationReports(reconciliationReports.results);
}

function seedRules() {
  return serveUtils.addRules(rules.results);
}

function seedPdrs() {
  return serveUtils.addPdrs(pdrs.results);
}

function uploadReconciliationReportFiles() {
  const reconcileReportList = fs
    .readdirSync(reconciliationReportDir)
    .map((f) => {
      let data = fs.readFileSync(`${reconciliationReportDir}/${f}`).toString();
      data = f.endsWith('.csv') ? CSV.parse(data) : JSON.parse(data);
      return {
        filename: f,
        data,
      };
    });

  return Promise.all(
    reconcileReportList.map((obj) => {
      const { filename, data } = obj;
      const body = filename.endsWith('.csv') ? CSV.stringify(data) : JSON.stringify(data);
      return promiseS3Upload({
        params: {
          Bucket: `${localSystemBucket}`,
          Key: `${localStackName}/reconciliation-reports/${filename}`,
          Body: body,
        },
      });
    })
  );
}

function seedGranulesExecutions() {
  const updatedGranules = granulesExecutions.map((granuleExecution) => {
    const granule = granules.results.find((g) => g.granuleId === granuleExecution.granuleId);
    const execution = executions.results.find((e) => e.arn === granuleExecution.executionArn);
    return { ...granule, execution: execution.execution };
  });
  return serveUtils.addGranules(updatedGranules);
}

function seedEverything() {
  return Promise.all([
    resetIt()
      .then(seedProviders)
      .then(seedCollections)
      .then(seedExecutions)
      .then(seedPdrs)
      .then(seedGranules)
      .then(seedGranulesExecutions)
      .then(seedRules)
      .then(seedReconciliationReports),
    uploadReconciliationReportFiles(),
  ]);
}

module.exports = {
  resetIt,
  seedEverything,
  uploadReconciliationReportFiles,
};
