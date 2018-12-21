'use strict';
import compareVersions from 'compare-versions';
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
import * as types from './types';

const root = _config.apiRoot;
const { pageLimit, minCompatibleApiVersion } = _config;

export const refreshAccessToken = (token, dispatch) => {
  const start = new Date();
  log('REFRESH_TOKEN_INFLIGHT');
  dispatch({ type: types.REFRESH_TOKEN_INFLIGHT });

  return new Promise((resolve, reject) => {
    post(configureRequest(
      {
        url: url.resolve(root, 'refresh')
      },
      { token }
    ), (error, data) => {
      if (error) {
        dispatch({
          type: types.REFRESH_TOKEN_ERROR,
          error
        });
        return reject(error);
      }
      const duration = new Date() - start;
      log('REFRESH_TOKEN', duration + 'ms');
      dispatch({
        type: types.REFRESH_TOKEN,
        token: data.token
      });
      return resolve();
    });
  });
};

export const setTokenState = (token) => ({ type: types.SET_TOKEN, token });

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const getCollection = (name, version) => wrapRequest(
  getCollectionId({name, version}), get, `collections?name=${name}&version=${version}`, types.COLLECTION);

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
              type: types.API_VERSION_ERROR,
              payload: { error }
            });
            return reject(error);
          }
          dispatch({
            type: types.API_VERSION,
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
    if (compareVersions(versionNumber, minCompatibleApiVersion) >= 0) {
      dispatch({
        type: types.API_VERSION_COMPATIBLE
      });
    } else {
      dispatch({
        type: types.API_VERSION_INCOMPATIBLE,
        payload: {
          warning: `Dashboard version incompatible with Cumulus API version (${versionNumber})`
        }
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
              type: types.COLLECTIONS_ERROR,
              error
            });
            return reject(error);
          }
          dispatch({
            type: types.COLLECTIONS,
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
  getCollectionId(payload), post, 'collections', types.NEW_COLLECTION, payload);

export const updateCollection = (payload) => wrapRequest(
  getCollectionId(payload), put, `collections/${payload.name}/${payload.version}`, types.UPDATE_COLLECTION, payload);

export const clearUpdateCollection = (collectionName) => ({ type: types.UPDATE_COLLECTION_CLEAR, id: collectionName });

export const deleteCollection = (name, version) => wrapRequest(
  getCollectionId({name, version}), del, `collections/${name}/${version}`, types.COLLECTION_DELETE);

export const searchCollections = (prefix) => ({ type: types.SEARCH_COLLECTIONS, prefix: prefix });
export const clearCollectionsSearch = () => ({ type: types.CLEAR_COLLECTIONS_SEARCH });
export const filterCollections = (param) => ({ type: types.FILTER_COLLECTIONS, param: param });
export const clearCollectionsFilter = (paramKey) => ({ type: types.CLEAR_COLLECTIONS_FILTER, paramKey: paramKey });

export const getCumulusInstanceMetadata = () => wrapRequest(null, get, 'instanceMeta', types.ADD_INSTANCE_META_CMR);

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
            type: types.ADD_MMTLINK,
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
  granuleId, get, `granules/${granuleId}`, types.GRANULE);

export const listGranules = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'granules'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.GRANULES);

// only query the granules from the last hour
export const getRecentGranules = () => wrapRequest(null, get, {
  url: url.resolve(root, 'granules'),
  qs: {
    limit: 1,
    fields: 'granuleId',
    updatedAt__from: moment().subtract(1, 'hour').format()
  }
}, types.RECENT_GRANULES);

export const reprocessGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, types.GRANULE_REPROCESS, {
    action: 'reprocess'
  });

export const applyWorkflowToGranule = (granuleId, workflow) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, types.GRANULE_APPLYWORKFLOW, {
    action: 'applyWorkflow',
    workflow
  });

export const reingestGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, types.GRANULE_REINGEST, {
    action: 'reingest'
  });

export const removeGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, types.GRANULE_REMOVE, {
    action: 'removeFromCmr'
  });

export const deleteGranule = (granuleId) => wrapRequest(
  granuleId, del, `granules/${granuleId}`, types.GRANULE_DELETE);

export const searchGranules = (prefix) => ({ type: types.SEARCH_GRANULES, prefix: prefix });
export const clearGranulesSearch = () => ({ type: types.CLEAR_GRANULES_SEARCH });
export const filterGranules = (param) => ({ type: types.FILTER_GRANULES, param: param });
export const clearGranulesFilter = (paramKey) => ({ type: types.CLEAR_GRANULES_FILTER, paramKey: paramKey });

export const getOptionsCollectionName = () => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: { limit: 100, fields: 'name,version' }
}, types.OPTIONS_COLLECTIONNAME);

export const getStats = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats'),
  qs: options
}, types.STATS);

// count queries *must* include type and field properties.
export const getCount = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/aggregate'),
  qs: Object.assign({ type: 'must-include-type', field: 'status' }, options)
}, types.COUNT);

export const listPdrs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.PDRS);

export const getPdr = (pdrName) => wrapRequest(
  pdrName, get, `pdrs/${pdrName}`, types.PDR);

export const searchPdrs = (prefix) => ({ type: types.SEARCH_PDRS, prefix: prefix });
export const clearPdrsSearch = () => ({ type: types.CLEAR_PDRS_SEARCH });
export const filterPdrs = (param) => ({ type: types.FILTER_PDRS, param: param });
export const clearPdrsFilter = (paramKey) => ({ type: types.CLEAR_PDRS_FILTER, paramKey: paramKey });

export const listProviders = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'providers'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.PROVIDERS);

export const getOptionsProviderGroup = () => wrapRequest(null, get, {
  url: url.resolve(root, 'providers'),
  qs: { limit: 100, fields: 'providerName' }
}, types.OPTIONS_PROVIDERGROUP);

export const getProvider = (providerId) => wrapRequest(
  providerId, get, `providers/${providerId}`, types.PROVIDER);

export const createProvider = (providerId, payload) => wrapRequest(
  providerId, post, 'providers', types.NEW_PROVIDER, payload);

export const updateProvider = (providerId, payload) => wrapRequest(
  providerId, put, `providers/${providerId}`, types.UPDATE_PROVIDER, payload);

export const clearUpdateProvider = (providerId) => ({ type: types.UPDATE_PROVIDER_CLEAR, id: providerId });

export const deleteProvider = (providerId) => wrapRequest(
  providerId, del, `providers/${providerId}`, types.PROVIDER_DELETE);

export const searchProviders = (prefix) => ({ type: types.SEARCH_PROVIDERS, prefix: prefix });
export const clearProvidersSearch = () => ({ type: types.CLEAR_PROVIDERS_SEARCH });
export const filterProviders = (param) => ({ type: types.FILTER_PROVIDERS, param: param });
export const clearProvidersFilter = (paramKey) => ({ type: types.CLEAR_PROVIDERS_FILTER, paramKey: paramKey });

export const deletePdr = (pdrName) => wrapRequest(
  pdrName, del, `pdrs/${pdrName}`, types.PDR_DELETE);

export const getLogs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs'),
  qs: Object.assign({limit: 100}, options)
}, types.LOGS);
export const clearLogs = () => ({ type: types.CLEAR_LOGS });

export const deleteToken = (dispatch, token) => {
  return new Promise((resolve) => {
    const config = configureRequest({
      url: url.resolve(root, `tokenDelete/${token}`)
    });

    del(config, () => {
      // Whether or not request to delete the token on the server
      // was successful, delete the local token
      dispatch({
        type: types.DELETE_TOKEN
      });
      return resolve();
    });
  });
};

export const logout = (dispatch, token) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: types.LOGOUT }));
};

export const forceLogout = (dispatch, token, error) => {
  return deleteToken(dispatch, token)
    .then(() => dispatch({ type: types.LOGIN_ERROR, error }));
};

export const login = (token) => {
  // dummy request to test the auth token
  return wrapRequest('auth', get, {
    url: url.resolve(root, 'granules'),
    qs: { limit: 1, fields: 'granuleId' },
    headers: {
      Authorization: 'Bearer ' + token
    }
  }, types.LOGIN);
};

export const getSchema = (type) => wrapRequest(null, get, `schemas/${type}`, types.SCHEMA);

export const queryHistogram = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/histogram'),
  qs: options
}, types.HISTOGRAM);

export const listWorkflows = (options) => wrapRequest(null, get, 'workflows', types.WORKFLOWS);

export const getExecutionStatus = (arn) => wrapRequest(null, get, {
  url: url.resolve(root, 'executions/status/' + arn)
}, types.EXECUTION_STATUS);

export const getExecutionLogs = (executionName) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs/' + executionName)
}, types.EXECUTION_LOGS);

export const listExecutions = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'executions'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.EXECUTIONS);

export const filterExecutions = (param) => ({ type: types.FILTER_EXECUTIONS, param: param });
export const clearExecutionsFilter = (paramKey) => ({ type: types.CLEAR_EXECUTIONS_FILTER, paramKey: paramKey });

export const listRules = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'rules'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.RULES);

export const getRule = (ruleName) => wrapRequest(
  ruleName, get, `rules?name=${ruleName}`, types.RULE);

export const updateRule = (payload) => wrapRequest(
  payload.name, put, `rules/${payload.name}`, types.UPDATE_RULE, payload);

export const clearUpdateRule = (ruleName) => ({ type: types.UPDATE_RULE_CLEAR, id: ruleName });

export const createRule = (payload) => wrapRequest(
  payload.name, post, 'rules', types.NEW_RULE, payload);

export const deleteRule = (ruleName) => wrapRequest(
  ruleName, del, `rules/${ruleName}`, types.RULE_DELETE);

export const enableRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, types.RULE_ENABLE, {
    state: 'ENABLED'
  });

export const disableRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, types.RULE_DISABLE, {
    state: 'DISABLED'
  });

export const rerunRule = (ruleName) => wrapRequest(
  ruleName, put, `rules/${ruleName}`, types.RULE_RERUN, {
    action: 'rerun'
  });

export const listReconciliationReports = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'reconciliationReports'),
  qs: Object.assign({ limit: pageLimit }, options)
}, types.RECONCILIATIONS);

export const getReconciliationReport = (reconciliationName) => wrapRequest(
  reconciliationName, get, `reconciliationReports/${reconciliationName}`, types.RECONCILIATION);

export const createReconciliationReport = () => wrapRequest(
  `reconciliation-report-${new Date().toISOString()}`, post, 'reconciliationReports', types.NEW_RECONCILIATION);

export const searchReconciliationReports = (prefix) => ({ type: types.SEARCH_RECONCILIATIONS, prefix: prefix });
export const clearReconciliationReportSearch = () => ({ type: types.CLEAR_RECONCILIATIONS_SEARCH });
