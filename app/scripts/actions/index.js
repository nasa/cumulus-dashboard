'use strict';
import moment from 'moment';
import url from 'url';
import { get as getProperty } from 'object-path';
import requestPromise from 'request-promise';
import { hashHistory } from 'react-router';
import { CMR, hostId } from '@cumulus/cmrjs';

import {
  get,
  post,
  put,
  del,
  configureRequest,
  wrapRequest
} from './helpers';
import _config from '../config';
import { getCollectionId } from '../utils/format';
import log from '../utils/log';

const root = _config.apiRoot;
const { pageLimit } = _config;

export const LOGOUT = 'LOGOUT';
export const LOGIN = 'LOGIN';
export const LOGIN_INFLIGHT = 'LOGIN_INFLIGHT';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const ADD_INSTANCE_META_CMR = 'ADD_INSTANCE_META_CMR';

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

export const ADD_MMTLINK = 'ADD_MMTLINK';

export const GRANULE = 'GRANULE';
export const GRANULE_INFLIGHT = 'GRANULE_INFLIGHT';
export const GRANULE_ERROR = 'GRANULE_ERROR';

export const GRANULES = 'GRANULES';
export const GRANULES_INFLIGHT = 'GRANULES_INFLIGHT';
export const GRANULES_ERROR = 'GRANULES_ERROR';

export const GRANULE_APPLYWORKFLOW = 'GRANULE_APPLYWORKFLOW';
export const GRANULE_APPLYWORKFLOW_INFLIGHT = 'GRANULE_APPLYWORKFLOW_INFLIGHT';
export const GRANULE_APPLYWORKFLOW_ERROR = 'GRANULE_APPLYWORKFLOW_ERROR';

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

export const EXECUTION_LOGS = 'EXECUTION_LOGS';
export const EXECUTION_LOGS_INFLIGHT = 'EXECUTION_LOGS_INFLIGHT';
export const EXECUTION_LOGS_ERROR = 'EXECUTION_LOGS_ERROR';

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

export const RULE_RERUN = 'RULE_RERUN';
export const RULE_RERUN_INFLIGHT = 'RULE_RERUN_INFLIGHT';
export const RULE_RERUN_ERROR = 'RULE_RERUN_ERROR';

export const RULE_ENABLE = 'RULE_ENABLE';
export const RULE_ENABLE_INFLIGHT = 'RULE_ENABLE_INFLIGHT';
export const RULE_ENABLE_ERROR = 'RULE_ENABLE_ERROR';

export const RULE_DISABLE = 'RULE_DISABLE';
export const RULE_DISABLE_INFLIGHT = 'RULE_DISABLE_INFLIGHT';
export const RULE_DISABLE_ERROR = 'RULE_DISABLE_ERROR';

export const RECONCILIATION = 'RECONCILIATION';
export const RECONCILIATION_INFLIGHT = 'RECONCILIATION_INFLIGHT';
export const RECONCILIATION_ERROR = 'RECONCILIATION_ERROR';

export const RECONCILIATIONS = 'RECONCILIATIONS';
export const RECONCILIATIONS_INFLIGHT = 'RECONCILIATIONS_INFLIGHT';
export const RECONCILIATIONS_ERROR = 'RECONCILIATIONS_ERROR';

export const SEARCH_RECONCILIATIONS = 'SEARCH_RECONCILIATIONS';
export const CLEAR_RECONCILIATIONS_SEARCH = 'CLEAR_RECONCILIATIONS_SEARCH';

export const NEW_RECONCILIATION = 'NEW_RECONCILIATION';
export const NEW_RECONCILIATION_INFLIGHT = 'NEW_RECONCILIATION_INFLIGHT';
export const NEW_RECONCILIATION_ERROR = 'NEW_RECONCILIATION_ERROR';

export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const REFRESH_TOKEN_ERROR = 'REFRESH_TOKEN_ERROR';
export const REFRESH_TOKEN_INFLIGHT = 'REFRESH_TOKEN_INFLIGHT';

export const SET_TOKEN = 'SET_TOKEN';

export const CALL_API = 'CALL_API';

export const refreshAccessToken = (token, dispatch) => {
  const start = new Date();
  log('REFRESH_TOKEN_INFLIGHT');
  dispatch({ type: REFRESH_TOKEN_INFLIGHT });

  const requestConfig = configureRequest({
    method: 'POST',
    url: url.resolve(root, 'refresh'),
    body: { token }
  });
  return requestPromise(requestConfig)
    .then(({ body }) => {
      const duration = new Date() - start;
      log('REFRESH_TOKEN', duration + 'ms');
      return dispatch({
        type: REFRESH_TOKEN,
        token: body.token
      });
    })
    .catch(({ error }) => {
      return dispatch({
        type: REFRESH_TOKEN_ERROR,
        error
      });
    });
};

export const setTokenState = (token) => ({ type: SET_TOKEN, token });

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const getCollection = (name, version) => ({
  [CALL_API]: {
    type: COLLECTION,
    method: 'GET',
    id: getCollectionId({name, version}),
    path: `collections?name=${name}&version=${version}`
  }
});

export const listCollections = (options) => {
  return (dispatch) => {
    return dispatch({
      [CALL_API]: {
        type: COLLECTIONS,
        method: 'GET',
        id: null,
        url: url.resolve(root, 'collections'),
        qs: Object.assign({ limit: pageLimit }, options)
      }
    }).then(() => {
      return dispatch(getMMTLinks());
    });
  };
};

export const createCollection = (payload) => ({
  [CALL_API]: {
    type: NEW_COLLECTION,
    method: 'POST',
    id: getCollectionId(payload),
    path: 'collections',
    body: payload
  }
});

export const updateCollection = (payload) => ({
  [CALL_API]: {
    type: UPDATE_COLLECTION,
    method: 'PUT',
    id: getCollectionId(payload),
    path: `collections/${payload.name}/${payload.version}`,
    body: payload
  }
});

export const clearUpdateCollection = (collectionName) => ({ type: UPDATE_COLLECTION_CLEAR, id: collectionName });

export const deleteCollection = (name, version) => ({
  [CALL_API]: {
    type: COLLECTION_DELETE,
    method: 'DELETE',
    id: getCollectionId({name, version}),
    path: `collections/${name}/${version}`
  }
});

export const searchCollections = (prefix) => ({ type: SEARCH_COLLECTIONS, prefix: prefix });
export const clearCollectionsSearch = () => ({ type: CLEAR_COLLECTIONS_SEARCH });
export const filterCollections = (param) => ({ type: FILTER_COLLECTIONS, param: param });
export const clearCollectionsFilter = (paramKey) => ({ type: CLEAR_COLLECTIONS_FILTER, paramKey: paramKey });

export const getCumulusInstanceMetadata = () => ({
  [CALL_API]: {
    type: ADD_INSTANCE_META_CMR,
    method: 'GET',
    path: 'instanceMeta'
  }
});

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

export const getGranule = (granuleId) => ({
  [CALL_API]: {
    type: GRANULE,
    method: 'GET',
    id: granuleId,
    path: `granules/${granuleId}`
  }
});

export const listGranules = (options) => ({
  [CALL_API]: {
    type: GRANULES,
    method: 'GET',
    id: null,
    url: url.resolve(root, 'granules'),
    qs: Object.assign({ limit: pageLimit }, options)
  }
});

// only query the granules from the last hour
export const getRecentGranules = () => ({
  [CALL_API]: {
    type: RECENT_GRANULES,
    method: 'GET',
    path: 'granules',
    qs: {
      limit: 1,
      fields: 'granuleId',
      updatedAt__from: moment().subtract(1, 'hour').format()
    }
  }
});

export const reprocessGranule = (granuleId) => ({
  [CALL_API]: {
    type: GRANULE_REPROCESS,
    method: 'PUT',
    id: granuleId,
    path: `granules/${granuleId}`,
    body: {
      action: 'reprocess'
    }
  }
});

export const applyWorkflowToGranule = (granuleId, workflow) => ({
  [CALL_API]: {
    type: GRANULE_APPLYWORKFLOW,
    method: 'PUT',
    id: granuleId,
    path: `granules/${granuleId}`,
    body: {
      action: 'applyWorkflow',
      workflow
    }
  }
});

export const reingestGranule = (granuleId) => ({
  [CALL_API]: {
    type: GRANULE_REINGEST,
    method: 'PUT',
    id: granuleId,
    path: `granules/${granuleId}`,
    body: {
      action: 'reingest'
    }
  }
});

export const removeGranule = (granuleId) => ({
  [CALL_API]: {
    type: GRANULE_REMOVE,
    method: 'PUT',
    id: granuleId,
    path: `granules/${granuleId}`,
    body: {
      action: 'removeFromCmr'
    }
  }
});

export const deleteGranule = (granuleId) => ({
  [CALL_API]: {
    type: GRANULE_DELETE,
    method: 'DELETE',
    id: granuleId,
    path: `granules/${granuleId}`
  }
});

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
export const getCount = (options) => ({
  [CALL_API]: {
    type: COUNT,
    method: 'GET',
    id: null,
    url: url.resolve(root, 'stats/aggregate'),
    qs: Object.assign({ type: 'must-include-type', field: 'status' }, options)
  }
});

// export const listPdrs = (options) => wrapRequest(null, get, {
//   url: url.resolve(root, 'pdrs'),
//   qs: Object.assign({ limit: pageLimit }, options)
// }, PDRS);

export const listPdrs = (options) => ({
  [CALL_API]: {
    type: PDRS,
    method: 'GET',
    url: url.resolve(root, 'pdrs'),
    qs: Object.assign({ limit: pageLimit }, options)
  }
});

// export const getPdr = (pdrName) => wrapRequest(
//   pdrName, get, `pdrs/${pdrName}`, PDR);

export const getPdr = (pdrName) => ({
  [CALL_API]: {
    type: PDR,
    method: 'GET',
    id: pdrName,
    path: `pdrs/${pdrName}`
  }
});

export const searchPdrs = (prefix) => ({ type: SEARCH_PDRS, prefix: prefix });
export const clearPdrsSearch = () => ({ type: CLEAR_PDRS_SEARCH });
export const filterPdrs = (param) => ({ type: FILTER_PDRS, param: param });
export const clearPdrsFilter = (paramKey) => ({ type: CLEAR_PDRS_FILTER, paramKey: paramKey });

// export const listProviders = (options) => wrapRequest(null, get, {
//   url: url.resolve(root, 'providers'),
//   qs: Object.assign({ limit: pageLimit }, options)
// }, PROVIDERS);

export const listProviders = (options) => ({
  [CALL_API]: {
    type: PROVIDERS,
    method: 'GET',
    url: url.resolve(root, 'providers'),
    qs: Object.assign({ limit: pageLimit }, options)
  }
});

// export const getOptionsProviderGroup = () => wrapRequest(null, get, {
//   url: url.resolve(root, 'providers'),
//   qs: { limit: 100, fields: 'providerName' }
// }, OPTIONS_PROVIDERGROUP);

export const getOptionsProviderGroup = () => ({
  [CALL_API]: {
    type: OPTIONS_PROVIDERGROUP,
    method: 'GET',
    url: url.resolve(root, 'providers'),
    qs: { limit: 100, fields: 'providerName' }
  }
});

// export const getProvider = (providerId) => wrapRequest(
//   providerId, get, `providers/${providerId}`, PROVIDER);

export const getProvider = (providerId) => ({
  [CALL_API]: {
    type: PROVIDER,
    id: providerId,
    method: 'GET',
    path: `providers/${providerId}`
  }
});

// export const createProvider = (providerId, payload) => wrapRequest(
//   providerId, post, 'providers', NEW_PROVIDER, payload);

export const createProvider = (providerId, payload) => ({
  [CALL_API]: {
    type: NEW_PROVIDER,
    id: providerId,
    method: 'POST',
    path: 'providers',
    body: payload
  }
});

// export const updateProvider = (providerId, payload) => wrapRequest(
//   providerId, put, `providers/${providerId}`, UPDATE_PROVIDER, payload);

export const updateProvider = (providerId, payload) => ({
  [CALL_API]: {
    type: UPDATE_PROVIDER,
    id: providerId,
    method: 'PUT',
    path: 'providers',
    body: payload
  }
});

export const clearUpdateProvider = (providerId) => ({ type: UPDATE_PROVIDER_CLEAR, id: providerId });

// export const deleteProvider = (providerId) => wrapRequest(
//   providerId, del, `providers/${providerId}`, PROVIDER_DELETE);

export const deleteProvider = (providerId) => ({
  [CALL_API]: {
    type: PROVIDER_DELETE,
    id: providerId,
    method: 'DELETE',
    path: `providers/${providerId}`
  }
});

// export const restartProvider = (providerId) => wrapRequest(
//   providerId, put, `providers/${providerId}`, PROVIDER_RESTART, {
//     action: 'restart'
//   });

export const restartProvider = (providerId) => ({
  [CALL_API]: {
    type: PROVIDER_RESTART,
    id: providerId,
    method: 'PUT',
    path: `providers/${providerId}`,
    body: {
      action: 'restart'
    }
  }
});

export const clearRestartedProvider = (providerId) => ({ type: CLEAR_RESTARTED_PROVIDER, id: providerId });

// export const stopProvider = (providerId) => wrapRequest(
//   providerId, put, `providers/${providerId}`, PROVIDER_STOP, {
//     action: 'stop'
//   });

export const stopProvider = (providerId) => ({
  [CALL_API]: {
    type: PROVIDER_STOP,
    id: providerId,
    method: 'PUT',
    path: `providers/${providerId}`,
    body: {
      action: 'stop'
    }
  }
});

export const clearStoppedProvider = (providerId) => ({ type: CLEAR_STOPPED_PROVIDER, id: providerId });
export const searchProviders = (prefix) => ({ type: SEARCH_PROVIDERS, prefix: prefix });
export const clearProvidersSearch = () => ({ type: CLEAR_PROVIDERS_SEARCH });
export const filterProviders = (param) => ({ type: FILTER_PROVIDERS, param: param });
export const clearProvidersFilter = (paramKey) => ({ type: CLEAR_PROVIDERS_FILTER, paramKey: paramKey });

// export const deletePdr = (pdrName) => wrapRequest(
//   pdrName, del, `pdrs/${pdrName}`, PDR_DELETE);

export const deletePdr = (pdrName) => ({
  [CALL_API]: {
    type: PDR_DELETE,
    id: pdrName,
    method: 'DELETE',
    path: `pdrs/${pdrName}`
  }
});

// export const getLogs = (options) => wrapRequest(null, get, {
//   url: url.resolve(root, 'logs'),
//   qs: Object.assign({limit: 100}, options)
// }, LOGS);

export const getLogs = (options) => ({
  [CALL_API]: {
    type: LOGS,
    method: 'GET',
    url: url.resolve(root, 'logs'),
    qs: Object.assign({limit: 100}, options)
  }
});

export const clearLogs = () => ({ type: CLEAR_LOGS });

export const DELETE_TOKEN = 'DELETE_TOKEN';

export const logout = (dispatch, token) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: LOGOUT }));
};

export const forceLogout = (dispatch, token, error) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: 'LOGIN_ERROR', error }));
};

export const login = (token) => {
  return (dispatch) => {
    // dispatch(setTokenState(token));
    dispatch({
      [CALL_API]: {
        type: LOGIN,
        id: 'auth',
        method: 'GET',
        url: url.resolve(root, 'granules'),
        qs: { limit: 1, fields: 'granuleId' },
        skipAuth: true,
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    });
  };
};

export const deleteToken = () => {
  return (dispatch, getState) => {
    const token = getProperty(getState(), 'api.tokens.token');
    if (!token) return Promise.resolve();

    const requestConfig = configureRequest({
      url: url.resolve(root, 'tokenRevoke'),
      body: {
        token
      }
    });
    return requestPromise(requestConfig)
      .finally(() => dispatch({ type: DELETE_TOKEN }));
  };
};

export const loginError = (error) => {
  return (dispatch) => {
    return dispatch(deleteToken())
      .then(() => dispatch({ type: 'LOGIN_ERROR', error }))
      .then(() => hashHistory.push('/auth'));
  };
};

export const getSchema = (type) => wrapRequest(null, get, `schemas/${type}`, SCHEMA);

export const queryHistogram = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/histogram'),
  qs: options
}, HISTOGRAM);

// export const listWorkflows = (options) => wrapRequest(null, get, 'workflows', WORKFLOWS);

export const listWorkflows = (options) => ({
  [CALL_API]: {
    type: WORKFLOWS,
    method: 'GET',
    id: null,
    url: url.resolve(root, 'workflows')
  }
});

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
