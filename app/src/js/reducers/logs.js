'use strict';
import { set, get } from 'object-path';
import moment from 'moment';

import {
  LOGS,
  LOGS_ERROR,
  LOGS_INFLIGHT,
  CLEAR_LOGS
} from '../actions/types';
import { createReducer } from '@reduxjs/toolkit';

export const initialState = {
  items: []
};

// https://momentjs.com/docs/#/displaying/
const format = 'MM/DD/YY hh:mma ss:SSS[s]';

export default createReducer(initialState, {

  [LOGS]: (state, action) => {
    const { data } = action;
    if (Array.isArray(data.results) && data.results.length) {
      data.results.forEach(processLog);
      let items = data.results.concat(state.items);
      items = dedupe(items);
      set(state, 'items', items);
    }
    set(state, 'inflight', false);
    set(state, 'queriedAt', Date.now());
    set(state, 'error', false);
  },
  [LOGS_INFLIGHT]: (state, action) => {
    const query = get(action.config, 'qs.q', '');
    const replace = state.query !== query;
    if (replace) {
      set(state, 'items', []);
    }
    set(state, 'inflight', true);
    set(state, 'query', query);
  },
  [LOGS_ERROR]: (state, action) => {
    set(state, 'inflight', false);
    set(state, 'error', action.error);
  },
  [CLEAR_LOGS]: (state, action) => {
    set(state, 'inflight', false);
    set(state, 'error', action.error);
    set(state, 'items', []);
  }

});

function processLog (d) {
  d.displayTime = moment(d.timestamp).format(format);
  d.displayText = d.message || d.msg;
  d.key = d.timestamp + '-' + d.displayText;
  let metafields = '';
  for (const key in d) {
    metafields += ' ' + d[key];
  }
  d.searchkey = metafields;
}

function dedupe (items) {
  const deduped = [];
  const keymap = {};
  items.forEach(d => {
    if (d.timestamp && d.displayText && !keymap[d.key]) {
      keymap[d.key] = 1;
      deduped.push(d);
    }
  });
  return deduped;
}
