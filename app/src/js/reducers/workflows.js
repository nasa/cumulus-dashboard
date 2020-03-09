'use strict';
import { set } from 'object-path';
import cloneDeep from 'lodash.clonedeep';
import {
  WORKFLOWS,
  WORKFLOWS_INFLIGHT,
  WORKFLOWS_ERROR
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {},
    inflight: false,
    error: false
  },
  map: {}
};

function createMap (data) {
  const map = {};
  data.forEach(d => {
    map[d.name] = d;
  });
  return map;
}

export default function reducer (state = initialState, action) {
  let newState = null;
  const { data } = action;
  switch (action.type) {
    case WORKFLOWS:
      newState = cloneDeep(state);
      set(newState, 'map', createMap(data));
      set(newState, ['list', 'data'], data);
      set(newState, ['list', 'meta'], { queriedAt: new Date() });
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], false);
      break;
    case WORKFLOWS_INFLIGHT:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], true);
      break;
    case WORKFLOWS_ERROR:
      newState = cloneDeep(state);
      set(newState, ['list', 'inflight'], false);
      set(newState, ['list', 'error'], action.error);
      break;
  }
  return newState || state;
}
