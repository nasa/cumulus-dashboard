/* eslint-disable import/no-cycle */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import api from './api';
import apiVersion from './api-version';
import cmrInfo from './cmr-info';
import collections from './collections';
import config from './utils/config';
import dist from './dist';
import datepicker from './datepicker';
import granules from './granules';
import stats from './stats';
import pdrs from './pdrs';
import providers from './providers';
import logs from './logs';
import schema from './schema';
import timer from './timer';
import workflows from './workflows';
import executions from './executions';
import executionStatus from './execution-status';
import executionLogs from './execution-logs';
import operations from './operations';
import rules from './rules';
import reconciliationReports from './reconciliation-reports';
import cumulusInstance from './cumulus-instance';
import sidebar from './sidebar';
import sorts from './sort-persist';

const def = (state, _action) => state || {};

export const reducers = {
  def,
  api,
  apiVersion,
  cmrInfo,
  collections,
  config,
  dist,
  datepicker,
  cumulusInstance,
  granules,
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
  sorts,
};

export const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  ...reducers,
});
