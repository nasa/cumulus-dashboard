'use strict';
import url from 'url';
import { get, post, put, wrapRequest } from './helpers';
import { set as setToken } from '../utils/auth';
import _config from '../config';

const root = _config.apiRoot;
const { pageLimit, searchPageLimit } = _config;

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
export const SEARCH_COLLECTIONS_INFLIGHT = 'SEARCH_COLLECTIONS_INFLIGHT';
export const SEARCH_COLLECTIONS_ERROR = 'SEARCH_COLLECTIONS_ERROR';
export const CLEAR_COLLECTIONS_SEARCH = 'CLEAR_COLLECTIONS_SEARCH';

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
export const SEARCH_GRANULES_INFLIGHT = 'SEARCH_GRANULES_INFLIGHT';
export const SEARCH_GRANULES_ERROR = 'SEARCH_GRANULES_ERROR';
export const CLEAR_GRANULES_SEARCH = 'CLEAR_GRANULES_SEARCH';

export const STATS = 'STATS';

export const PDRS = 'PDRS';
export const PDRS_INFLIGHT = 'PDRS_INFLIGHT';
export const PDRS_ERROR = 'PDRS_ERROR';

export const SEARCH_PDRS = 'SEARCH_PDRS';
export const SEARCH_PDRS_INFLIGHT = 'SEARCH_PDRS_INFLIGHT';
export const SEARCH_PDRS_ERROR = 'SEARCH_PDRS_ERROR';
export const CLEAR_PDRS_SEARCH = 'CLEAR_PDRS_SEARCH';

export const LOGS = 'LOGS';
export const LOGS_INFLIGHT = 'LOGS_INFLIGHT';
export const LOGS_ERROR = 'LOGS_ERROR';

export const SCHEMA = 'SCHEMA';
export const SCHEMA_INFLIGHT = 'SCHEMA_INFLIGHT';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';

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

export const searchCollections = (query) => wrapRequest(null, get, {
  url: url.resolve(root, 'collections'),
  qs: Object.assign({ limit: searchPageLimit }, query)
}, SEARCH_COLLECTIONS);

export const clearCollectionsSearch = () => ({ type: CLEAR_COLLECTIONS_SEARCH });

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

export const searchGranules = (query) => wrapRequest(null, get, {
  url: url.resolve(root, 'granules'),
  qs: Object.assign({ limit: searchPageLimit }, query)
}, SEARCH_GRANULES);

export const clearGranuleSearch = () => ({ type: CLEAR_GRANULES_SEARCH });

export const getStats = () => wrapRequest(null, get, 'stats/summary/grouped', STATS);

export const listPdrs = (options) => wrapRequest(null, get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: pageLimit }, options)
}, PDRS);

export const searchPdrs = (query) => wrapRequest(null, get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: searchPageLimit }, query)
}, SEARCH_PDRS);

export const clearPdrSearch = () => ({ type: CLEAR_PDRS_SEARCH });

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

export const getSchema = (type) => wrapRequest(null, get, `schemas/${type}`, SCHEMA);
