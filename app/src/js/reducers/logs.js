'use strict';
import { set, get } from 'object-path';
import moment from 'moment';

import {
  LOGS,
  LOGS_ERROR,
  LOGS_INFLIGHT,
  CLEAR_LOGS
} from '../actions/types';

export const initialState = {
  items: []
};

// https://momentjs.com/docs/displaying/
const format = 'MM/DD/YY hh:mma ss:SSS[s]';

export default function reducer (state = initialState, action) {
  let nextState = Object.assign({}, state);
  const { data } = action;
  switch (action.type) {
    case LOGS:
      if (Array.isArray(data.results) && data.results.length) {
        data.results.forEach(processLog);
        let items = data.results.concat(state.items);
        items = dedupe(items);
        set(nextState, 'items', items);
      }
      set(nextState, 'inflight', false);
      set(nextState, 'queriedAt', new Date());
      set(nextState, 'error', false);
      break;
    case LOGS_INFLIGHT:
      const query = get(action.config, 'qs.q', '');
      const replace = state.query !== query;
      if (replace) {
        set(nextState, 'items', []);
      }
      set(nextState, 'inflight', true);
      set(nextState, 'query', query);
      break;
    case LOGS_ERROR:
      set(nextState, 'inflight', false);
      set(nextState, 'error', action.error);
      break;
    case CLEAR_LOGS:
      set(nextState, 'inflight', false);
      set(nextState, 'error', action.error);
      set(nextState, 'items', []);
      break;
  }
  return nextState;
}

function processLog (d) {
  d.displayTime = moment(d.timestamp).format(format);
  d.displayText = d.message || d.msg;
  d.key = d.timestamp + '-' + d.displayText;
  let metafields = '';
  for (let key in d) {
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
