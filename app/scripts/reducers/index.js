import { combineReducers } from 'redux';
import api from './api';
import apiVersion from './api-version';
import collections from './collections';
import config from './config';
import dist from './dist';
import granules from './granules';
import granuleCSV from './granule-csv';
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
import cumulusInstance from './cumulus-instance';

export const reducers = {
  def: (state = {}, action) => state,
  api,
  apiVersion,
  collections,
  config,
  dist,
  mmtLinks,
  cumulusInstance,
  granules,
  granuleCSV,
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
