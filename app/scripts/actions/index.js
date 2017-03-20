'use strict';
import url from 'url';
import { get, post, put, wrapRequest } from './helpers';
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

export const GRANULE = 'GRANULE';
export const GRANULE_INFLIGHT = 'GRANULE_INFLIGHT';
export const GRANULE_ERROR = 'GRANULE_ERROR';

export const GRANULES = 'GRANULES';
export const GRANULES_INFLIGHT = 'GRANULES_INFLIGHT';
export const GRANULES_ERROR = 'GRANULES_ERROR';

export const GRANULE_REPROCESS = 'GRANULE_REPROCESS';
export const GRANULE_REPROCESS_INFLIGHT = 'GRANULE_REPROCESS_INFLIGHT';
export const GRANULE_REPROCESS_ERROR = 'GRANULE_REPROCESS_ERROR';

export const SEARCH_GRANULES = 'SEARCH_GRANULES';
export const CLEAR_GRANULES_SEARCH = 'CLEAR_GRANULES_SEARCH';

export const FILTER_GRANULES = 'FILTER_GRANULES';
export const CLEAR_GRANULES_FILTER = 'CLEAR_GRANULES_FILTER';

export const OPTIONS_COLLECTIONNAME = 'OPTIONS_COLLECTIONNAME';
export const OPTIONS_COLLECTIONNAME_INFLIGHT = 'OPTIONS_COLLECTIONNAME_INFLIGHT';
export const OPTIONS_COLLECTIONNAME_ERROR = 'OPTIONS_COLLECTIONNAME_ERROR';

export const STATS = 'STATS';

export const PDRS = 'PDRS';
export const PDRS_INFLIGHT = 'PDRS_INFLIGHT';
export const PDRS_ERROR = 'PDRS_ERROR';

export const SEARCH_PDRS = 'SEARCH_PDRS';
export const CLEAR_PDRS_SEARCH = 'CLEAR_PDRS_SEARCH';

export const FILTER_PDRS = 'FILTER_PDRS';
export const CLEAR_PDRS_FILTER = 'CLEAR_PDRS_FILTER';

export const PROVIDERS = 'PROVIDERS';
export const PROVIDERS_INFLIGHT = 'PROVIDERS_INFLIGHT';
export const PROVIDERS_ERROR = 'PROVIDERS_ERROR';

export const SEARCH_PROVIDERS = 'SEARCH_PROVIDERS';
export const CLEAR_PROVIDERS_SEARCH = 'CLEAR_PROVIDERS_SEARCH';

export const FILTER_PROVIDERS = 'FILTER_PROVIDERS';
export const CLEAR_PROVIDERS_FILTER = 'CLEAR_PROVIDERS_FILTER';

export const LOGS = 'LOGS';
export const LOGS_INFLIGHT = 'LOGS_INFLIGHT';
export const LOGS_ERROR = 'LOGS_ERROR';

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

export const searchGranules = (prefix) => ({ type: SEARCH_GRANULES, prefix: prefix });

export const clearGranulesSearch = () => ({ type: CLEAR_GRANULES_SEARCH });

export const filterGranules = (param) => ({ type: FILTER_GRANULES, param: param });

export const clearGranulesFilter = (paramKey) => ({ type: CLEAR_GRANULES_FILTER, paramKey: paramKey });

export const getOptionsCollectionName = () => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: { limit: 100, fields: 'collectionName' }
}, OPTIONS_COLLECTIONNAME);

export const getStats = () => wrapRequest(null, get, 'stats/summary/grouped', STATS);

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

export const searchProviders = (prefix) => ({ type: SEARCH_PROVIDERS, prefix: prefix });

export const clearProvidersSearch = () => ({ type: CLEAR_PROVIDERS_SEARCH });

export const filterProviders = (param) => ({ type: FILTER_PROVIDERS, param: param });

export const clearProvidersFilter = (paramKey) => ({ type: CLEAR_PROVIDERS_FILTER, paramKey: paramKey });

export const getLogs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'logs'),
  qs: Object.assign({ limit: 50 }, options)
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
