'use strict';
import moment from 'moment';
import url from 'url';
import { CMR, hostId } from '@cumulus/cmrjs';
import {
  get,
  post,
  put,
  del,
  configureRequest,
  wrapRequest,
  addRequestAuthorization
} from './helpers';
import _config from '../config';
import { getCollectionId } from '../utils/format';
import log from '../utils/log';
import { REFRESH_TOKEN_INFLIGHT, REFRESH_TOKEN_ERROR, REFRESH_TOKEN, SET_TOKEN, COLLECTION, API_VERSION_ERROR, API_VERSION, API_VERSION_INCOMPATIBLE, API_VERSION_COMPATIBLE, COLLECTIONS_ERROR, COLLECTIONS, NEW_COLLECTION, UPDATE_COLLECTION, UPDATE_COLLECTION_CLEAR, COLLECTION_DELETE, SEARCH_COLLECTIONS, CLEAR_COLLECTIONS_SEARCH, FILTER_COLLECTIONS, CLEAR_COLLECTIONS_FILTER, ADD_INSTANCE_META_CMR, ADD_MMTLINK, GRANULE, GRANULES, RECENT_GRANULES, GRANULE_REPROCESS, GRANULE_APPLYWORKFLOW, GRANULE_REINGEST, GRANULE_REMOVE, GRANULE_DELETE, SEARCH_GRANULES, CLEAR_GRANULES_SEARCH, FILTER_GRANULES, CLEAR_GRANULES_FILTER, OPTIONS_COLLECTIONNAME, STATS, COUNT, PDRS, PDR, SEARCH_PDRS, CLEAR_PDRS_SEARCH, FILTER_PDRS, CLEAR_PDRS_FILTER, PROVIDERS, OPTIONS_PROVIDERGROUP, PROVIDER, NEW_PROVIDER, UPDATE_PROVIDER, UPDATE_PROVIDER_CLEAR, PROVIDER_DELETE, PROVIDER_RESTART, CLEAR_RESTARTED_PROVIDER, PROVIDER_STOP, CLEAR_STOPPED_PROVIDER, SEARCH_PROVIDERS, CLEAR_PROVIDERS_SEARCH, FILTER_PROVIDERS, CLEAR_PROVIDERS_FILTER, PDR_DELETE, LOGS, CLEAR_LOGS, LOGOUT, LOGIN, SCHEMA, HISTOGRAM, WORKFLOWS, EXECUTION_STATUS, EXECUTION_LOGS, EXECUTIONS, FILTER_EXECUTIONS, CLEAR_EXECUTIONS_FILTER, RULES, RULE, UPDATE_RULE, UPDATE_RULE_CLEAR, NEW_RULE, RULE_DELETE, RULE_ENABLE, RULE_DISABLE, RULE_RERUN, RECONCILIATIONS, RECONCILIATION, NEW_RECONCILIATION, SEARCH_RECONCILIATIONS, CLEAR_RECONCILIATIONS_SEARCH } from './types';

const root = _config.apiRoot;
const { pageLimit, compatibleApiVersion } = _config;

export const refreshAccessToken = (token, dispatch) => {
  const start = new Date();
  log('REFRESH_TOKEN_INFLIGHT');
  dispatch({ type: REFRESH_TOKEN_INFLIGHT });

  return new Promise((resolve, reject) => {
    post(configureRequest(
      {
        url: url.resolve(root, 'refresh')
      },
      { token }
    ), (error, data) => {
      if (error) {
        dispatch({
          type: REFRESH_TOKEN_ERROR,
          error
        });
        return reject(error);
      }
      const duration = new Date() - start;
      log('REFRESH_TOKEN', duration + 'ms');
      dispatch({
        type: REFRESH_TOKEN,
        token: data.token
      });
      return resolve();
    });
  });
};

export const setTokenState = (token) => ({ type: SET_TOKEN, token });

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const getCollection = (name, version) => wrapRequest(
  getCollectionId({name, version}), get, `collections?name=${name}&version=${version}`, COLLECTION);

export const getApiVersion = () => {
  return (dispatch, getState) => {
    const wrapApiVersion = () => {
      return new Promise((resolve, reject) => {
        const config = configureRequest({
          url: url.resolve(root, 'version')
        });
        get(config, (error, data) => {
          if (error) {
            dispatch({
              type: API_VERSION_ERROR,
              payload: { error }
            });
            return reject(error);
          }
          dispatch({
            type: API_VERSION,
            payload: { versionNumber: data.api_version }
          });
          return resolve();
        });
      });
    };
    return wrapApiVersion().then(() => {
      return dispatch(checkApiVersion());
    });
  };
};

export const checkApiVersion = () => {
  return (dispatch, getState) => {
    const { versionNumber } = getState().apiVersion;
    if (compatibleApiVersion.indexOf(versionNumber) < 0) {
      dispatch({
        type: API_VERSION_INCOMPATIBLE,
        payload: {
          warning: `Dashboard version incompatible with Cumulus API version (${versionNumber})`
        }
      });
    } else {
      dispatch({
        type: API_VERSION_COMPATIBLE,
        payload: {}
      });
    }
  };
};

export const listCollections = (options) => {
  return (dispatch, getState) => {
    // wrap the request for collections data in a promise to make
    // it thenable and make it easier to create chained actions
    const wrapListCollections = () => {
      return new Promise((resolve, reject) => {
        const config = configureRequest({
          url: url.resolve(root, 'collections'),
          qs: Object.assign({ limit: pageLimit }, options)
        });
        addRequestAuthorization(config, getState);
        get(config, (error, data) => {
          if (error) {
            dispatch({
              type: COLLECTIONS_ERROR,
              error
            });
            return reject(error);
          }
          dispatch({
            type: COLLECTIONS,
            data
          });
          return resolve();
        });
      });
    };
    return wrapListCollections().then(() => {
      return dispatch(getMMTLinks());
    });
  };
};

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

export const getCumulusInstanceMetadata = () => wrapRequest(null, get, 'instanceMeta', ADD_INSTANCE_META_CMR);

/**
 * Iterates over each collection in the application collections state dispatching the
 * action to add the MMT link to the its state.
 * @returns {function} anonymous redux-thunk function.
 */
export const getMMTLinks = () => {
  return (dispatch, getState) => {
    const { data } = getState().collections.list;
    data.forEach((collection) => {
      getMMTLinkFromCmr(collection, getState)
        .then((url) => {
          const action = {
            type: ADD_MMTLINK,
            data: { name: collection.name, version: collection.version, url: url }
          };
          dispatch(action);
        })
        .catch((error) => console.error(error));
    });
  };
};

/**
 *
 * @param {Object} collection - application collections item.
 * @param {function} getState - redux function to access app state.
 * @returns {Promise<string>} - Promise for a Metadata Management Toolkit (MMT) Link
 *                              to the input collection or null if it doesn't exist.
 */
export const getMMTLinkFromCmr = (collection, getState) => {
  const {cmrProvider, cmrEnvironment} = getState().cumulusInstance;
  if (!cmrProvider || !cmrEnvironment) return null;

  const mmtLinks = getState().mmtLinks;
  if (getCollectionId(collection) in mmtLinks) {
    return Promise.resolve(mmtLinks[getCollectionId(collection)]);
  }
  const search = new CMR(cmrProvider);
  return search.searchCollections({short_name: collection.name, version: collection.version})
    .then((results) => {
      if (results.length === 1) {
        const conceptId = results[0].id;
        if (conceptId) {
          return buildMMTLink(conceptId, cmrEnvironment);
        }
      }
      return null;
    })
    .catch((error) => {
      console.log(error);
    });
};

/**
 * Build correct link to collection based on conceptId and cumulus environment.
 *
 * @param {string} conceptId - CMR's concept id
 * @param {string} cmrEnv - cumulus instance operating environ UAT/SIT/PROD.
 * @returns {string} MMT link to edit the collection at conceptId.
 */
export const buildMMTLink = (conceptId, cmrEnv) => {
  const url = ['mmt', hostId(cmrEnv), 'earthdata.nasa.gov'].filter((d) => d).join('.');
  return `https://${url}/collections/${conceptId}`;
};

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

export const applyWorkflowToGranule = (granuleId, workflow) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, GRANULE_APPLYWORKFLOW, {
    action: 'applyWorkflow',
    workflow
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

export const DELETE_TOKEN = 'DELETE_TOKEN';
export const deleteToken = (dispatch, token) => {
  return new Promise((resolve) => {
    const config = configureRequest({
      url: url.resolve(root, `tokenDelete/${token}`)
    });

    del(config, () => {
      // Whether or not request to delete the token on the server
      // was successful, delete the local token
      dispatch({
        type: DELETE_TOKEN
      });
      return resolve();
    });
  });
};

export const logout = (dispatch, token) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: LOGOUT }));
};

export const forceLogout = (dispatch, token, error) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: 'LOGIN_ERROR', error }));
};

export const login = (token) => {
  // dummy request to test the auth token
  return wrapRequest('auth', get, {
    url: url.resolve(root, 'granules'),
    qs: { limit: 1, fields: 'granuleId' },
    headers: {
      Authorization: 'Bearer ' + token
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
  url: url.resolve(root, 'executions/status/' + arn)
}, EXECUTION_STATUS);

export const getExecutionLogs = (executionName) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs/' + executionName)
}, EXECUTION_LOGS);

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

export const updateRule = (payload) => wrapRequest(
  payload.name, put, `rules/${payload.name}`, UPDATE_RULE, payload);

export const clearUpdateRule = (ruleName) => ({ type: UPDATE_RULE_CLEAR, id: ruleName });

export const createRule = (payload) => wrapRequest(
  payload.name, post, 'rules', NEW_RULE, payload);

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

export const rerunRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, RULE_RERUN, {
    action: 'rerun'
  });

export const listReconciliationReports = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'reconciliationReports'),
  qs: Object.assign({ limit: pageLimit }, options)
}, RECONCILIATIONS);

export const getReconciliationReport = (reconciliationName) => wrapRequest(
  reconciliationName, get, `reconciliationReports/${reconciliationName}`, RECONCILIATION);

export const createReconciliationReport = () => wrapRequest(
  `reconciliation-report-${new Date().toISOString()}`, post, 'reconciliationReports', NEW_RECONCILIATION);

export const searchReconciliationReports = (prefix) => ({ type: SEARCH_RECONCILIATIONS, prefix: prefix });
export const clearReconciliationReportSearch = () => ({ type: CLEAR_RECONCILIATIONS_SEARCH });
