'use strict';
import url from 'url';
import request from 'request';
import config from '../config';

export const ERROR = 'ERROR';
export const AUTHENTICATED = 'AUTHENTICATED';
export const LIST_COLLECTIONS = 'LIST_COLLECTIONS';
export const QUERY_COLLECTION = 'QUERY_COLLECTION';
export const GET_COLLECTION = 'GET_COLLECTION';
export const POST_COLLECTION = 'POST_COLLECTION';
export const LIST_GRANULES = 'LIST_GRANULES';

export function setError (error) {
  return { type: ERROR, data: error };
}

export function setCollections (collections) {
  return { type: LIST_COLLECTIONS, data: collections };
}

export function queryCollection (collectionName) {
  return { type: QUERY_COLLECTION, data: { collectionName } };
}

export function setCollection (collection) {
  return { type: GET_COLLECTION, data: collection };
}

function setGranules (granules) {
  return { type: LIST_GRANULES, data: granules };
}

export function setPostSuccess (type, post) {
  return {
    type,
    data: post.data,
    key: post.id,
    postType: post.type
  };
}

const root = config.apiRoot;
function get (path, callback) {
  request(url.resolve(root, path), (error, resp, body) => {
    if (error) {
      return callback(error);
    }
    try {
      var data = JSON.parse(body);
    } catch (e) {
      return callback('JSON parse error');
    }
    return callback(null, data);
  });
}

function post (path, payload, callback) {
  request.post({
    url: url.resolve(root, path),
    body: payload,
    json: true
  }, (error, resp, body) => {
    error = error || body.errorMessage;
    if (error) {
      return callback(error);
    } else {
      return callback(null, body);
    }
  });
}

export function listCollections () {
  return function (dispatch) {
    get('collections', (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: LIST_COLLECTIONS
          }
        }));
      } else {
        return dispatch(setCollections(data.results));
      }
    });
  };
}

export function getCollection (collectionName) {
  return function (dispatch) {
    dispatch(queryCollection(collectionName));
    get(`collections?collectionName=${collectionName}`, (error, data) => {
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

export function createCollection (payload) {
  return function (dispatch) {
    post('collections', payload, (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: POST_COLLECTION,
            id: payload.collectionName
          }
        }));
      } else {
        return dispatch(setPostSuccess(POST_COLLECTION, {
          type: 'collection',
          id: data.collectionName,
          data
        }));
      }
    });
  };
}

export function listGranules () {
  return function (dispatch) {
    get('granules', (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: LIST_COLLECTIONS
          }
        }));
      } else {
        return dispatch(setGranules(data));
      }
    });
  };
}

export function getStats () {
  return function (dispatch) {
    get('stats/summary/grouped', (error, data) => {
      if (error) {
        return dispatch(setError({
          error,
          meta: {
            type: GET_STATS
          }
        }));
      } else {
        return dispatch(setStats(data));
      }
    });
  };
}
