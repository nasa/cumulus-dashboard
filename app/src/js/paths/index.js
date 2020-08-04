import collections from './collections';
import granules from './granules';
import pdrs from './pdrs';
import providers from './providers';
import errors from './errors';
import workflows from './workflows';
import executions from './executions';
import operations from './operations';
import rules from './rules';
import reconciliationReports from './reconciliation-reports';

const paths = [collections, granules, pdrs, providers, errors, workflows, executions, operations,
  rules, reconciliationReports];
export default paths;
