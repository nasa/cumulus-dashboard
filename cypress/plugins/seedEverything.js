const { testUtils } = require('@cumulus/api');
const { promiseS3Upload } = require('@cumulus/aws-client/S3');
const fs = require('fs');
const path = require('path');
const serveUtils = require('@cumulus/api/bin/serveUtils');
const {
  localUserName,
  localStackName,
  localSystemBucket,
} = require('@cumulus/api/bin/local-test-defaults');

const asyncOperations = require('../fixtures/seeds/asyncOperationsFixture.json');
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
  process.env.system_bucket = localSystemBucket;
  process.env.stackName = localStackName;
  process.env.ReconciliationReportsTable = `${localStackName}-ReconciliationReportsTable`;

  return Promise.all([
    testUtils.setAuthorizedOAuthUsers([localUserName]),
    serveUtils.resetPostgresDb(),
  ]);
}

function seedAsyncOperations() {
  return serveUtils.addAsyncOperations(asyncOperations.results);
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
  return serveUtils.addRules(rules.results, false);
}

function seedPdrs() {
  return serveUtils.addPdrs(pdrs.results);
}

function uploadReconciliationReportFiles() {
  const reconcileReportList = fs
    .readdirSync(reconciliationReportDir)
    .map((f) => {
      const filePath = `${reconciliationReportDir}/${f}`;
      const data = fs.readFileSync(filePath);
      return {
        filename: f,
        data,
      };
    });

  return Promise.all(
    reconcileReportList.map(({ filename, data }) => promiseS3Upload({
      params: {
        Bucket: `${localSystemBucket}`,
        Key: `${localStackName}/reconciliation-reports/${filename}`,
        Body: data,
      },
    }))
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
      .then(seedReconciliationReports)
      .then(seedAsyncOperations),
    uploadReconciliationReportFiles(),
  ]);
}

module.exports = {
  resetIt,
  seedEverything,
  uploadReconciliationReportFiles,
};
