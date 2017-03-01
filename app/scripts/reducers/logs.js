'use strict';

import {
  LOGS,
  LOGS_INFLIGHT,
  LOGS_ERROR
} from '../actions';

export const initialState = {
  logs: []
};

export default function reducer (state = initialState, action) {
  let nextState;
  const { data, type, id } = action;
  switch (type) {
    case LOGS:
      nextState = { logs: data };
      break;
  }
  return nextState || state;
}
