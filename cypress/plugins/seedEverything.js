import testUtils from '@cumulus/api';
import promiseS3Upload from '@cumulus/aws-client/S3';
import fs from 'fs';
import path from 'path';
import CSV from 'csv-string';
import serveUtils from '@cumulus/api/bin/serveUtils';
import eraseDataStack from '@cumulus/api/bin/serve';
import {
  localUserName,
  localStackName,
  localSystemBucket,
} from '@cumulus/api/bin/local-test-defaults';

import collections from '../fixtures/seeds/collectionsFixture.json';
import executions from '../fixtures/seeds/executionsFixture.json';
import granules from '../fixtures/seeds/granulesFixture.json';
import granulesExecutions from '../fixtures/seeds/granulesExecutionsFixture.json';
import providers from '../fixtures/seeds/providersFixture.json';
import rules from '../fixtures/seeds/rulesFixture.json';
import pdrs from '../fixtures/seeds/pdrsFixture.json';
import reconciliationReports from '../fixtures/seeds/reconciliationReportFixture.json';
const reconciliationReportDir = path.resolve(__dirname, '../fixtures/seeds/reconciliation-reports');

export function resetIt() {
  process.env.system_bucket = localSystemBucket;
  process.env.stackName = localStackName;
  process.env.ReconciliationReportsTable = `${localStackName}-ReconciliationReportsTable`;

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
  return serveUtils.addRules(rules.results, false);
}

function seedPdrs() {
  return serveUtils.addPdrs(pdrs.results);
}

export function uploadReconciliationReportFiles() {
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

export function seedEverything() {
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
