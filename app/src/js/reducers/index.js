/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import api from './api.js';
import apiVersion from './api-version.js';
import cmrInfo from './cmr-info.js';
import collections from './collections.js';
import config from './utils/config.js';
import datepicker from './datepicker.js';
import granules from './granules.js';
import granulesExecutions from './granules-executions.js';
import stats from './stats.js';
import pdrs from './pdrs.js';
import providers from './providers.js';
import logs from './logs.js';
import schema from './schema.js';
import timer from './timer.js';
import workflows from './workflows.js';
import executions from './executions.js';
import executionStatus from './execution-status.js';
import executionLogs from './execution-logs.js';
import operations from './operations.js';
import rules from './rules.js';
import reconciliationReports from './reconciliation-reports.js';
import recoveryStatus from './recovery-status.js';
import cumulusInstance from './cumulus-instance.js';
import sidebar from './sidebar.js';
import sorts from './sort-persist.js';
import locationQueryParams from './location-query-params.js';

const def = (state, _action) => state || {};

export const reducers = {
  def,
  api,
  apiVersion,
  cmrInfo,
  collections,
  config,
  datepicker,
  cumulusInstance,
  granules,
  granulesExecutions,
  stats,
  timer,
  sidebar,
  pdrs,
  providers,
  logs,
  schema,
  workflows,
  executions,
  executionStatus,
  executionLogs,
  operations,
  rules,
  reconciliationReports,
  recoveryStatus,
  sorts,
  locationQueryParams,
};

export const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
});
