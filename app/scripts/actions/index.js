'use strict';
import url from 'url';
import { get, post, put, del, wrapRequest } from './helpers';
import { set as setToken } from '../utils/auth';
import _config from '../config';

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

export const OPTIONS_COLLECTIONNAME = 'OPTIONS_COLLECTIONNAME';
export const OPTIONS_COLLECTIONNAME_INFLIGHT = 'OPTIONS_COLLECTIONNAME_INFLIGHT';
export const OPTIONS_COLLECTIONNAME_ERROR = 'OPTIONS_COLLECTIONNAME_ERROR';

export const STATS = 'STATS';
export const STATS_INFLIGHT = 'STATS_INFLIGHT';
export const STATS_ERROR = 'STATS_ERROR';

export const RESOURCES = 'RESOURCES';
export const RESOURCES_INFLIGHT = 'RESOURCES_INFLIGHT';
export const RESOURCES_ERROR = 'RESOURCES_ERROR';

export const COUNT = 'COUNT';
export const COUNT_INFLIGHT = 'COUNT_INFLIGHT';
export const COUNT_ERROR = 'COUNT_ERROR';

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

export const SCHEMA = 'SCHEMA';
export const SCHEMA_INFLIGHT = 'SCHEMA_INFLIGHT';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';

export const HISTOGRAM = 'HISTOGRAM';
export const HISTOGRAM_INFLIGHT = 'HISTOGRAM_INFLIGHT';
export const HISTOGRAM_ERROR = 'HISTOGRAM_ERROR';

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const getCollection = (collectionName) => wrapRequest(
  collectionName, get, `collections?collectionName=${collectionName}`, COLLECTION);

export const listCollections = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: Object.assign({ limit: pageLimit }, options)
}, COLLECTIONS);

export const createCollection = (payload) => wrapRequest(
  payload.collectionName, post, 'collections', NEW_COLLECTION, payload);

export const updateCollection = (payload) => wrapRequest(
  payload.collectionName, put, `collections/${payload.collectionName}`, UPDATE_COLLECTION, payload);

export const deleteCollection = (collectionName) => wrapRequest(
  collectionName, del, `collections/${collectionName}`, COLLECTION_DELETE);

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

export const reprocessGranule = (granuleId) => wrapRequest(
  granuleId, put, `granules/${granuleId}`, GRANULE_REPROCESS, {
    action: 'reprocess'
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
  qs: { limit: 100, fields: 'collectionName' }
}, OPTIONS_COLLECTIONNAME);

export const getStats = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats'),
  qs: options
}, STATS);

export const getResources = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'resources')
}, RESOURCES);

// count queries *must* include type and field properties.
export const getCount = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'stats/count'),
  qs: Object.assign({ type: 'must-include-type', field: 'status' }, options)
}, COUNT);

export const listPdrs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: pageLimit }, options)
}, PDRS);

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

export const createProvider = (payload) => wrapRequest(
  payload.name, post, 'providers', NEW_PROVIDER, payload);

export const updateProvider = (payload) => wrapRequest(
  payload.name, put, `providers/${payload.name}`, UPDATE_PROVIDER, payload);

export const deleteProvider = (providerId) => wrapRequest(
  providerId, del, `providers/${providerId}`, PROVIDER_DELETE);

export const restartProvider = (providerId) => wrapRequest(
  providerId, put, `providers/${providerId}`, PROVIDER_RESTART, {
    action: 'restart'
  });

export const clearRestartedProvider = (providerId) => ({ type: CLEAR_RESTARTED_PROVIDER, id: providerId });

export const searchProviders = (prefix) => ({ type: SEARCH_PROVIDERS, prefix: prefix });

export const clearProvidersSearch = () => ({ type: CLEAR_PROVIDERS_SEARCH });

export const filterProviders = (param) => ({ type: FILTER_PROVIDERS, param: param });

export const clearProvidersFilter = (paramKey) => ({ type: CLEAR_PROVIDERS_FILTER, paramKey: paramKey });

export const deletePdr = (pdrName) => wrapRequest(
  pdrName, del, `pdrs/${pdrName}`, PDR_DELETE);

export const getLogs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs'),
  qs: Object.assign({ limit: 200 }, options)
}, LOGS);

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

