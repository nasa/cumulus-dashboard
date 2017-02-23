'use strict';
import url from 'url';
import { get, post, put, wrapRequest } from './helpers';
import _config from '../config';
const root = _config.apiRoot;

export const ERROR = 'ERROR';
export const AUTHENTICATED = 'AUTHENTICATED';
export const QUERY_COLLECTION = 'QUERY_COLLECTION';
export const GET_COLLECTION = 'GET_COLLECTION';
export const LIST_COLLECTIONS = 'LIST_COLLECTIONS';
export const POST_COLLECTION = 'POST_COLLECTION';
export const PUT_COLLECTION = 'PUT_COLLECTION';
export const LIST_GRANULES = 'LIST_GRANULES';
export const GET_STATS = 'GET_STATS';
export const LIST_PDRS = 'LIST_PDRS';

export const setError = function (error) {
  return { type: ERROR, data: error };
};

const queryCollection = (collectionName) => ({ type: QUERY_COLLECTION, data: { collectionName } });
const setCollection = (collection) => ({ type: GET_COLLECTION, data: collection });
const setCollections = (collections) => ({ type: LIST_COLLECTIONS, data: collections.results });
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
const setGranules = (granules) => ({ type: LIST_GRANULES, data: granules });
const setStats = (stats) => ({ type: GET_STATS, data: stats });
const setPdrs = (pdrs) => ({ type: LIST_PDRS, data: pdrs });

export const listCollections = () => wrapRequest(get, 'collections', LIST_COLLECTIONS, setCollections);
export const createCollection = (payload) => wrapRequest(post, 'collections', payload, POST_COLLECTION, setPostCollection);
export const updateCollection = (payload) => wrapRequest(put, 'collections', payload, PUT_COLLECTION, setPutCollection);
export const listGranules = () => wrapRequest(get, 'granules', LIST_GRANULES, setGranules);
export const getStats = () => wrapRequest(get, 'stats/summary/grouped', GET_STATS, setStats);
export const listPdrs = () => wrapRequest(get, 'pdrs', LIST_PDRS, setPdrs);

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
            id: collectionName,
            data
          }
        }));
      } else {
        return dispatch(setCollection(data.results[0]));
      }
    });
  };
}
