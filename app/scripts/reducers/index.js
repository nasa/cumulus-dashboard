import { combineReducers } from 'redux';
import api from './api';
import collections from './collections';
import granules from './granules';
import stats from './stats';
import pdrs from './pdrs';
import providers from './providers';
import logs from './logs';
import schema from './schema';
import workflows from './workflows';
import executions from './executions';
import executionStatus from './execution-status';
import executionLogs from './execution-logs';
import rules from './rules';
import reconciliationReports from './reconciliation-reports';
import mmtLinks from './mmtLinks';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  collections,
  mmtLinks,
  granules,
  stats,
  pdrs,
  providers,
  logs,
  schema,
  workflows,
  executions,
  executionStatus,
  executionLogs,
  rules,
  reconciliationReports
};

export default combineReducers(Object.assign({}, reducers));
