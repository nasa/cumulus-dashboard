import collections from './collections.js';
import granules from './granules.js';
import pdrs from './pdrs.js';
import providers from './providers.js';
import errors from './errors.js';
import workflows from './workflows.js';
import executions from './executions.js';
import operations from './operations.js';
import rules from './rules.js';
import reconciliationReports from './reconciliation-reports.js';

const paths = [collections, granules, pdrs, providers, errors, workflows, executions, operations,
  rules, reconciliationReports];
export default paths;
