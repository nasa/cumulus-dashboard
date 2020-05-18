import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import api from './api';
import apiVersion from './api-version';
import collections from './collections';
import config from './utils/config';
import dist from './dist';
import datepicker from './datepicker';
import granules from './granules';
import granuleCSV from './granule-csv';
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
import mmtLinks from './mmtLinks';
import cumulusInstance from './cumulus-instance';

const def = (state, _action) => state || {};

export const reducers = {
  def,
  api,
  apiVersion,
  collections,
  config,
  dist,
  datepicker,
  mmtLinks,
  cumulusInstance,
  granules,
  granuleCSV,
  stats,
  timer,
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
};

export const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...reducers,
  });
