'use strict';
import { set, del } from 'object-path';

import {
  GRANULE_CSV,
  GRANULE_CSV_INFLIGHT,
  GRANULE_CSV_ERROR
} from '../actions/types';

export const initialState = {
  list: {
    data: [],
    meta: {},
    params: {}
  },
  csvData: {},
  dropdowns: {},
  map: {},
  meta: {},
  reprocessed: {},
  removed: {},
  reingested: {},
  recovered: {},
  executed: {},
  deleted: {},
  recent: {}
};

export default function reducer (state = initialState, action) {
  state = Object.assign({}, state);
  const { id, data } = action;
  let csvData, nextState;

  switch (action.type) {
    case GRANULE_CSV:
      console.log('in reducer for csv file');
      console.log(data);
      csvData = data;
      set(state, ['map', id, 'inflight'], false);
      nextState = Object.assign(state, { csvData });
      del(state, ['deleted', id]);
      break;
    case GRANULE_CSV_INFLIGHT:
      set(state, ['map', id, 'inflight'], true);
      break;
    case GRANULE_CSV_ERROR:
      set(state, ['map', id, 'inflight'], false);
      set(state, ['map', id, 'error'], action.error);
      break;
  }
  return nextState || state;
}
