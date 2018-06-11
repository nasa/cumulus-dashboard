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
import rules from './rules';
import reconciliationReports from './reconciliation-reports';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  collections,
  granules,
  stats,
  pdrs,
  providers,
  logs,
  schema,
  workflows,
  executions,
  executionStatus,
  rules,
  reconciliationReports
};

export default combineReducers(Object.assign({}, reducers));
