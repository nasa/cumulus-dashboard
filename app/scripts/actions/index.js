'use strict';
import moment from 'moment';
import url from 'url';
import { get, post, put, del, wrapRequest } from './helpers';
import { set as setToken } from '../utils/auth';
import _config from '../config';
import { getCollectionId } from '../utils/format';

const root = _config.apiRoot;
const { pageLimit } = _config;

export const LOGOUT = 'LOGOUT';
export const LOGIN = 'LOGIN';
export const LOGIN_INFLIGHT = 'LOGIN_INFLIGHT';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const COLLECTION = 'COLLECTION';
export const COLLECTION_INFLIGHT = 'COLLECTION_INFLIGHT';
export const COLLECTION_ERROR = 'COLLECTION_ERROR';

export const COLLECTIONS = 'COLLECTIONS';
export const COLLECTIONS_INFLIGHT = 'COLLECTIONS_INFLIGHT';
export const COLLECTIONS_ERROR = 'COLLECTIONS_ERROR';

export const NEW_COLLECTION = 'NEW_COLLECTION';
export const NEW_COLLECTION_INFLIGHT = 'NEW_COLLECTION_INFLIGHT';
export const NEW_COLLECTION_ERROR = 'NEW_COLLECTION_ERROR';

export const UPDATE_COLLECTION = 'UPDATE_COLLECTION';
export const UPDATE_COLLECTION_INFLIGHT = 'UPDATE_COLLECTION_INFLIGHT';
export const UPDATE_COLLECTION_ERROR = 'UPDATE_COLLECTION_ERROR';
export const UPDATE_COLLECTION_CLEAR = 'UPDATE_COLLECTION_CLEAR';

export const SEARCH_COLLECTIONS = 'SEARCH_COLLECTIONS';
export const CLEAR_COLLECTIONS_SEARCH = 'CLEAR_COLLECTIONS_SEARCH';

export const FILTER_COLLECTIONS = 'FILTER_COLLECTIONS';
export const CLEAR_COLLECTIONS_FILTER = 'CLEAR_COLLECTIONS_FILTER';

export const COLLECTION_DELETE = 'COLLECTION_DELETE';
export const COLLECTION_DELETE_INFLIGHT = 'COLLECTION_DELETE_INFLIGHT';
export const COLLECTION_DELETE_ERROR = 'COLLECTION_DELETE_ERROR';

export const GRANULE = 'GRANULE';
export const GRANULE_INFLIGHT = 'GRANULE_INFLIGHT';
export const GRANULE_ERROR = 'GRANULE_ERROR';

export const GRANULES = 'GRANULES';
export const GRANULES_INFLIGHT = 'GRANULES_INFLIGHT';
export const GRANULES_ERROR = 'GRANULES_ERROR';

export const GRANULE_REPROCESS = 'GRANULE_REPROCESS';
export const GRANULE_REPROCESS_INFLIGHT = 'GRANULE_REPROCESS_INFLIGHT';
export const GRANULE_REPROCESS_ERROR = 'GRANULE_REPROCESS_ERROR';

export const GRANULE_REINGEST = 'GRANULE_REINGEST';
export const GRANULE_REINGEST_INFLIGHT = 'GRANULE_REINGEST_INFLIGHT';
export const GRANULE_REINGEST_ERROR = 'GRANULE_REINGEST_ERROR';

export const GRANULE_REMOVE = 'GRANULE_REMOVE';
export const GRANULE_REMOVE_INFLIGHT = 'GRANULE_REMOVE_INFLIGHT';
export const GRANULE_REMOVE_ERROR = 'GRANULE_REMOVE_ERROR';

export const GRANULE_DELETE = 'GRANULE_DELETE';
export const GRANULE_DELETE_INFLIGHT = 'GRANULE_DELETE_INFLIGHT';
export const GRANULE_DELETE_ERROR = 'GRANULE_DELETE_ERROR';

export const SEARCH_GRANULES = 'SEARCH_GRANULES';
export const CLEAR_GRANULES_SEARCH = 'CLEAR_GRANULES_SEARCH';

export const FILTER_GRANULES = 'FILTER_GRANULES';
export const CLEAR_GRANULES_FILTER = 'CLEAR_GRANULES_FILTER';

export const RECENT_GRANULES = 'RECENT_GRANULES';
export const RECENT_GRANULES_INFLIGHT = 'RECENT_GRANULES_INFLIGHT';
export const RECENT_GRANULES_ERROR = 'RECENT_GRANULES_ERROR';

export const OPTIONS_COLLECTIONNAME = 'OPTIONS_COLLECTIONNAME';
export const OPTIONS_COLLECTIONNAME_INFLIGHT = 'OPTIONS_COLLECTIONNAME_INFLIGHT';
export const OPTIONS_COLLECTIONNAME_ERROR = 'OPTIONS_COLLECTIONNAME_ERROR';

export const STATS = 'STATS';
export const STATS_INFLIGHT = 'STATS_INFLIGHT';
export const STATS_ERROR = 'STATS_ERROR';

export const COUNT = 'COUNT';
export const COUNT_INFLIGHT = 'COUNT_INFLIGHT';
export const COUNT_ERROR = 'COUNT_ERROR';

export const PDR = 'PDR';
export const PDR_INFLIGHT = 'PDR_INFLIGHT';
export const PDR_ERROR = 'PDR_ERROR';

export const PDRS = 'PDRS';
export const PDRS_INFLIGHT = 'PDRS_INFLIGHT';
export const PDRS_ERROR = 'PDRS_ERROR';

export const PDR_DELETE = 'PDR_DELETE';
export const PDR_DELETE_INFLIGHT = 'PDR_DELETE_INFLIGHT';
export const PDR_DELETE_ERROR = 'PDR_DELETE_ERROR';

export const SEARCH_PDRS = 'SEARCH_PDRS';
export const CLEAR_PDRS_SEARCH = 'CLEAR_PDRS_SEARCH';

export const FILTER_PDRS = 'FILTER_PDRS';
export const CLEAR_PDRS_FILTER = 'CLEAR_PDRS_FILTER';

export const PROVIDER = 'PROVIDER';
export const PROVIDER_INFLIGHT = 'PROVIDER_INFLIGHT';
export const PROVIDER_ERROR = 'PROVIDER_ERROR';

export const PROVIDER_COLLECTIONS = 'PROVIDER_COLLECTIONS';
export const PROVIDER_COLLECTIONS_INFLIGHT = 'PROVIDER_COLLECTIONS_INFLIGHT';
export const PROVIDER_COLLECTIONS_ERROR = 'PROVIDER_COLLECTIONS_ERROR';

export const NEW_PROVIDER = 'NEW_PROVIDER';
export const NEW_PROVIDER_INFLIGHT = 'NEW_PROVIDER_INFLIGHT';
export const NEW_PROVIDER_ERROR = 'NEW_PROVIDER_ERROR';

export const UPDATE_PROVIDER = 'UPDATE_PROVIDER';
export const UPDATE_PROVIDER_INFLIGHT = 'UPDATE_PROVIDER_INFLIGHT';
export const UPDATE_PROVIDER_ERROR = 'UPDATE_PROVIDER_ERROR';
export const UPDATE_PROVIDER_CLEAR = 'UPDATE_PROVIDER_CLEAR';

export const PROVIDERS = 'PROVIDERS';
export const PROVIDERS_INFLIGHT = 'PROVIDERS_INFLIGHT';
export const PROVIDERS_ERROR = 'PROVIDERS_ERROR';

export const PROVIDER_DELETE = 'PROVIDER_DELETE';
export const PROVIDER_DELETE_INFLIGHT = 'PROVIDER_DELETE_INFLIGHT';
export const PROVIDER_DELETE_ERROR = 'PROVIDER_DELETE_ERROR';

export const PROVIDER_RESTART = 'PROVIDER_RESTART';
export const PROVIDER_RESTART_INFLIGHT = 'PROVIDER_RESTART_INFLIGHT';
export const PROVIDER_RESTART_ERROR = 'PROVIDER_RESTART_ERROR';
export const CLEAR_RESTARTED_PROVIDER = 'CLEAR_RESTARTED_PROVIDER';

export const PROVIDER_STOP = 'PROVIDER_STOP';
export const PROVIDER_STOP_INFLIGHT = 'PROVIDER_STOP_INFLIGHT';
export const PROVIDER_STOP_ERROR = 'PROVIDER_STOP_ERROR';
export const CLEAR_STOPPED_PROVIDER = 'CLEAR_STOPPED_PROVIDER';

export const OPTIONS_PROVIDERGROUP = 'OPTIONS_PROVIDERGROUP';
export const OPTIONS_PROVIDERGROUP_INFLIGHT = 'OPTIONS_PROVIDERGROUP_INFLIGHT';
export const OPTIONS_PROVIDERGROUP_ERROR = 'OPTIONS_PROVIDERGROUP_ERROR';

export const SEARCH_PROVIDERS = 'SEARCH_PROVIDERS';
export const CLEAR_PROVIDERS_SEARCH = 'CLEAR_PROVIDERS_SEARCH';

export const FILTER_PROVIDERS = 'FILTER_PROVIDERS';
export const CLEAR_PROVIDERS_FILTER = 'CLEAR_PROVIDERS_FILTER';

export const LOGS = 'LOGS';
export const LOGS_INFLIGHT = 'LOGS_INFLIGHT';
export const LOGS_ERROR = 'LOGS_ERROR';
export const CLEAR_LOGS = 'CLEAR_LOGS';

export const SCHEMA = 'SCHEMA';
export const SCHEMA_INFLIGHT = 'SCHEMA_INFLIGHT';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';

export const HISTOGRAM = 'HISTOGRAM';
export const HISTOGRAM_INFLIGHT = 'HISTOGRAM_INFLIGHT';
export const HISTOGRAM_ERROR = 'HISTOGRAM_ERROR';

export const WORKFLOWS = 'WORKFLOWS';
export const WORKFLOWS_INFLIGHT = 'WORKFLOWS_INFLIGHT';
export const WORKFLOWS_ERROR = 'WORKFLOWS_ERROR';

export const EXECUTION_STATUS = 'EXECUTION_STATUS';
export const EXECUTION_STATUS_INFLIGHT = 'EXECUTION_STATUS_INFLIGHT';
export const EXECUTION_STATUS_ERROR = 'EXECUTION_STATUS_ERROR';

export const EXECUTIONS = 'EXECUTIONS';
export const EXECUTIONS_INFLIGHT = 'EXECUTIONS_INFLIGHT';
export const EXECUTIONS_ERROR = 'EXECUTIONS_ERROR';

export const FILTER_EXECUTIONS = 'FILTER_EXECUTIONS';
export const CLEAR_EXECUTIONS_FILTER = 'CLEAR_EXECUTIONS_FILTER';

export const RULES = 'RULES';
export const RULES_INFLIGHT = 'RULES_INFLIGHT';
export const RULES_ERROR = 'RULES_ERROR';

export const RULE = 'RULE';
export const RULE_INFLIGHT = 'RULE_INFLIGHT';
export const RULE_ERROR = 'RULE_ERROR';

export const UPDATE_RULE = 'UPDATE_RULE';
export const UPDATE_RULE_INFLIGHT = 'UPDATE_RULE_INFLIGHT';
export const UPDATE_RULE_ERROR = 'UPDATE_RULE_ERROR';
export const UPDATE_RULE_CLEAR = 'UPDATE_RULE_CLEAR';

export const NEW_RULE = 'NEW_RULE';
export const NEW_RULE_INFLIGHT = 'NEW_RULE_INFLIGHT';
export const NEW_RULE_ERROR = 'NEW_RULE_ERROR';

export const RULE_DELETE = 'RULE_DELETE';
export const RULE_DELETE_INFLIGHT = 'RULE_DELETE_INFLIGHT';
export const RULE_DELETE_ERROR = 'RULE_DELETE_ERROR';

export const RULE_ENABLE = 'RULE_ENABLE';
export const RULE_ENABLE_INFLIGHT = 'RULE_ENABLE_INFLIGHT';
export const RULE_ENABLE_ERROR = 'RULE_ENABLE_ERROR';

export const RULE_DISABLE = 'RULE_DISABLE';
export const RULE_DISABLE_INFLIGHT = 'RULE_DISABLE_INFLIGHT';
export const RULE_DISABLE_ERROR = 'RULE_DISABLE_ERROR';

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const getCollection = (name, version) => wrapRequest(
  getCollectionId({name, version}), get, `collections?name=${name}&version=${version}`, COLLECTION);

export const listCollections = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: Object.assign({ limit: pageLimit }, options)
}, COLLECTIONS);

export const createCollection = (payload) => wrapRequest(
  getCollectionId(payload), post, 'collections', NEW_COLLECTION, payload);

export const updateCollection = (payload) => wrapRequest(
  getCollectionId(payload), put, `collections/${payload.name}/${payload.version}`, UPDATE_COLLECTION, payload);

export const clearUpdateCollection = (collectionName) => ({ type: UPDATE_COLLECTION_CLEAR, id: collectionName });

export const deleteCollection = (name, version) => wrapRequest(
  getCollectionId({name, version}), del, `collections/${name}/${version}`, COLLECTION_DELETE);

export const searchCollections = (prefix) => ({ type: SEARCH_COLLECTIONS, prefix: prefix });
export const clearCollectionsSearch = () => ({ type: CLEAR_COLLECTIONS_SEARCH });
export const filterCollections = (param) => ({ type: FILTER_COLLECTIONS, param: param });
export const clearCollectionsFilter = (paramKey) => ({ type: CLEAR_COLLECTIONS_FILTER, paramKey: paramKey });

export const getGranule = (granuleId) => wrapRequest(
  granuleId, get, `granules/${granuleId}`, GRANULE);

export const listGranules = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'granules'),
  qs: Object.assign({ limit: pageLimit }, options)
}, GRANULES);

// only query the granules from the last hour
export const getRecentGranules = () => wrapRequest(null, get, {
  url: url.resolve(root, 'granules'),
  qs: {
    limit: 1,
    fields: 'granuleId',
    updatedAt__from: moment().subtract(1, 'hour').format()
  }
}, RECENT_GRANULES);

export const reprocessGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, GRANULE_REPROCESS, {
    action: 'reprocess'
  });

export const reingestGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, GRANULE_REINGEST, {
    action: 'reingest'
  });

export const removeGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, GRANULE_REMOVE, {
    action: 'removeFromCmr'
  });

export const deleteGranule = (granuleId) => wrapRequest(
  granuleId, del, `granules/${granuleId}`, GRANULE_DELETE);

export const searchGranules = (prefix) => ({ type: SEARCH_GRANULES, prefix: prefix });
export const clearGranulesSearch = () => ({ type: CLEAR_GRANULES_SEARCH });
export const filterGranules = (param) => ({ type: FILTER_GRANULES, param: param });
export const clearGranulesFilter = (paramKey) => ({ type: CLEAR_GRANULES_FILTER, paramKey: paramKey });

export const getOptionsCollectionName = () => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: { limit: 100, fields: 'name,version' }
}, OPTIONS_COLLECTIONNAME);

export const getStats = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats'),
  qs: options
}, STATS);

// count queries *must* include type and field properties.
export const getCount = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/aggregate'),
  qs: Object.assign({ type: 'must-include-type', field: 'status' }, options)
}, COUNT);

export const listPdrs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: pageLimit }, options)
}, PDRS);

export const getPdr = (pdrName) => wrapRequest(
  pdrName, get, `pdrs/${pdrName}`, PDR);

export const searchPdrs = (prefix) => ({ type: SEARCH_PDRS, prefix: prefix });
export const clearPdrsSearch = () => ({ type: CLEAR_PDRS_SEARCH });
export const filterPdrs = (param) => ({ type: FILTER_PDRS, param: param });
export const clearPdrsFilter = (paramKey) => ({ type: CLEAR_PDRS_FILTER, paramKey: paramKey });

export const listProviders = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'providers'),
  qs: Object.assign({ limit: pageLimit }, options)
}, PROVIDERS);

export const getOptionsProviderGroup = () => wrapRequest(null, get, {
  url: url.resolve(root, 'providers'),
  qs: { limit: 100, fields: 'providerName' }
}, OPTIONS_PROVIDERGROUP);

export const getProvider = (providerId) => wrapRequest(
  providerId, get, `providers/${providerId}`, PROVIDER);

export const createProvider = (providerId, payload) => wrapRequest(
  providerId, post, 'providers', NEW_PROVIDER, payload);

export const updateProvider = (providerId, payload) => wrapRequest(
  providerId, put, `providers/${providerId}`, UPDATE_PROVIDER, payload);

export const clearUpdateProvider = (providerId) => ({ type: UPDATE_PROVIDER_CLEAR, id: providerId });

export const deleteProvider = (providerId) => wrapRequest(
  providerId, del, `providers/${providerId}`, PROVIDER_DELETE);

export const restartProvider = (providerId) => wrapRequest(
  providerId, put, `providers/${providerId}`, PROVIDER_RESTART, {
    action: 'restart'
  });

export const clearRestartedProvider = (providerId) => ({ type: CLEAR_RESTARTED_PROVIDER, id: providerId });

export const stopProvider = (providerId) => wrapRequest(
  providerId, put, `providers/${providerId}`, PROVIDER_STOP, {
    action: 'stop'
  });

export const clearStoppedProvider = (providerId) => ({ type: CLEAR_STOPPED_PROVIDER, id: providerId });
export const searchProviders = (prefix) => ({ type: SEARCH_PROVIDERS, prefix: prefix });
export const clearProvidersSearch = () => ({ type: CLEAR_PROVIDERS_SEARCH });
export const filterProviders = (param) => ({ type: FILTER_PROVIDERS, param: param });
export const clearProvidersFilter = (paramKey) => ({ type: CLEAR_PROVIDERS_FILTER, paramKey: paramKey });

export const deletePdr = (pdrName) => wrapRequest(
  pdrName, del, `pdrs/${pdrName}`, PDR_DELETE);

export const getLogs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs'),
  qs: Object.assign({limit: 100}, options)
}, LOGS);
export const clearLogs = () => ({ type: CLEAR_LOGS });

export const logout = () => {
  setToken('');
  return { type: LOGOUT };
};

export const login = (token) => {
  // dummy request to test the auth token
  return wrapRequest('auth', get, {
    url: url.resolve(root, 'granules'),
    qs: { limit: 1, fields: 'granuleId' },
    headers: {
      Authorization: 'Basic ' + token
    }
  }, LOGIN);
};

export const getSchema = (type) => wrapRequest(null, get, `schemas/${type}`, SCHEMA);

export const queryHistogram = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/histogram'),
  qs: options
}, HISTOGRAM);

export const listWorkflows = (options) => wrapRequest(null, get, 'workflows', WORKFLOWS);

export const getExecutionStatus = (arn) => wrapRequest(null, get, {
  url: url.resolve(root, 'executionstatus/' + arn)
}, EXECUTION_STATUS);

export const listExecutions = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'executions'),
  qs: Object.assign({ limit: pageLimit }, options)
}, EXECUTIONS);

export const filterExecutions = (param) => ({ type: FILTER_EXECUTIONS, param: param });
export const clearExecutionsFilter = (paramKey) => ({ type: CLEAR_EXECUTIONS_FILTER, paramKey: paramKey });

export const listRules = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'rules'),
  qs: Object.assign({ limit: pageLimit }, options)
}, RULES);

export const getRule = (ruleName) => wrapRequest(
  ruleName, get, `rules?name=${ruleName}`, RULE);

export const updateRule = (name, payload) => wrapRequest(
  name, put, `rules/${name}`, UPDATE_RULE, payload);

export const clearUpdateRule = (ruleName) => ({ type: UPDATE_RULE_CLEAR, id: ruleName });

export const createRule = (id, payload) => wrapRequest(
  id, post, 'rules', NEW_RULE, payload);

export const deleteRule = (ruleName) => wrapRequest(
  ruleName, del, `rules/${ruleName}`, RULE_DELETE);

export const enableRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, RULE_ENABLE, {
    state: 'ENABLED'
  });

export const disableRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, RULE_DISABLE, {
    state: 'DISABLED'
  });
