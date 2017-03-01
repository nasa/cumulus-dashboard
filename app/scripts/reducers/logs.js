'use strict';
import moment from 'moment';

import {
  LOGS
} from '../actions';

export const initialState = {
  items: []
};

// https://momentjs.com/docs/#/displaying/
const format = 'MM/DD/YY hh:mma ss:SSS[s]';

export default function reducer (state = initialState, action) {
  let nextState;
  const { data } = action;
  switch (action.type) {
    case LOGS:
      if (Array.isArray(data.results) && data.results.length) {
        data.results.forEach(processLog);
        let items = data.results.concat(state.items);
        items = dedupe(items);
        nextState = { items };
      }
      break;
  }
  return nextState || state;
}

function processLog (d) {
  d.displayTime = moment(d.timestamp).format(format);
  const replace = '[' + d.level.toUpperCase() + ']';
  d.displayText = d.data.replace(replace, '').trim();
  d.key = d.timestamp + '-' + d.data;
}

function dedupe (items) {
  const deduped = [];
  const keymap = {};
  items.forEach(d => {
    if (!keymap[d.key]) {
      keymap[d.key] = 1;
      deduped.push(d);
    }
  });
  return deduped;
}
