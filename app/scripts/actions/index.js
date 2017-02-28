'use strict';
import url from 'url';
import { get, post, put, wrapRequest } from './helpers';
import _config from '../config';
const root = _config.apiRoot;
const pageLimit = _config.pageLimit;

export const ERROR = 'ERROR';
export const AUTHENTICATED = 'AUTHENTICATED';

export const QUERY_COLLECTION = 'QUERY_COLLECTION';
export const GET_COLLECTION = 'GET_COLLECTION';
export const LIST_COLLECTIONS = 'LIST_COLLECTIONS';
export const POST_COLLECTION = 'POST_COLLECTION';
export const PUT_COLLECTION = 'PUT_COLLECTION';

export const QUERY_GRANULE = 'QUERY_GRANULE';
export const GET_GRANULE = 'GET_GRANULE';
export const LIST_GRANULES = 'LIST_GRANULES';

export const GET_STATS = 'GET_STATS';
export const LIST_PDRS = 'LIST_PDRS';

export const setError = function (error) {
  return { type: ERROR, data: error };
};

const queryCollection = (collectionName) => ({ type: QUERY_COLLECTION, data: { collectionName } });
const setCollection = (collection) => ({ type: GET_COLLECTION, data: collection });
const setCollections = (collections) => ({ type: LIST_COLLECTIONS, data: collections });
const setPostCollection = (collection) => ({
  type: POST_COLLECTION,
  id: collection.collectionName,
  data: collection
});
const setPutCollection = (collection) => ({
  type: PUT_COLLECTION,
  id: collection.collectionName,
  data: collection
});

const queryGranule = (granuleId) => ({ type: QUERY_GRANULE, data: { granuleId } });
const setGranules = (granules) => ({ type: LIST_GRANULES, data: granules });
const setGranule = (granule) => ({ type: GET_GRANULE, data: granule });
const setStats = (stats) => ({ type: GET_STATS, data: stats });
const setPdrs = (pdrs) => ({ type: LIST_PDRS, data: pdrs });

export const interval = function (action, wait, immediate) {
  if (immediate) { action(); }
  const intervalId = setInterval(action, wait);
  return () => clearInterval(intervalId);
};

export const listCollections = (options) => wrapRequest(get, {
  url: url.resolve(root, 'collections'),
  qs: {
    page: options.page,
    limit: pageLimit
  }
}, LIST_COLLECTIONS, setCollections);
export const createCollection = (payload) => wrapRequest(post, 'collections', payload, POST_COLLECTION, setPostCollection);
export const updateCollection = (payload) => wrapRequest(put, 'collections', payload, PUT_COLLECTION, setPutCollection);
export const listGranules = (options) => wrapRequest(get, {
  url: url.resolve(root, 'granules'),
  qs: Object.assign({ limit: pageLimit }, options)
}, LIST_GRANULES, setGranules);
export const getStats = () => wrapRequest(get, 'stats/summary/grouped', GET_STATS, setStats);
export const listPdrs = (options) => wrapRequest(get, {
  url: url.resolve(root, 'pdrs'),
  qs: Object.assign({ limit: pageLimit }, options)
}, LIST_PDRS, setPdrs);

export function getCollection (collectionName) {
  return function (dispatch) {
    dispatch(queryCollection(collectionName));
    let path = url.resolve(root, `collections?collectionName=${collectionName}`);
    get(path, (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: GET_COLLECTION,
            url: path
          }
        }));
      } else {
        return dispatch(setCollection(data.results[0]));
      }
    });
  };
}

export function getGranule (granuleId) {
  return function (dispatch) {
    dispatch(queryGranule(granuleId));
    let path = url.resolve(root, `granules/${granuleId}`);
    get(path, (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: GET_GRANULE,
            url: path
          }
        }));
      } else {
        return dispatch(setGranule(data));
      }
    });
  };
}
