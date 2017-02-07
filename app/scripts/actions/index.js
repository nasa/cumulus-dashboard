'use strict';
import url from 'url';
import request from 'request';
import config from '../config';

export const ERROR = 'ERROR';
export const AUTHENTICATED = 'AUTHENTICATED';
export const LIST_COLLECTIONS = 'LIST_COLLECTIONS';
export const GET_COLLECTION = 'GET_COLLECTION';

export function setError (error) {
  return { type: ERROR, data: error };
}

export function setCollections (collections) {
  return { type: LIST_COLLECTIONS, data: collections };
}

export function setCollection (collection) {
  return { type: GET_COLLECTION, data: collection };
}

const root = config.apiRoot;
export function listCollections () {
  return function (dispatch) {
    request(url.resolve(root, 'collections'), (error, resp) => {
      if (error) {
        return dispatch(setError({ error, meta: 'listCollections'}));
      }
      return dispatch(setCollections(resp));
    });
  };
}

export function getCollection (collectionName) {
}
