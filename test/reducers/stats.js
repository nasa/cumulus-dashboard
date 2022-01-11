'use strict';
import test from 'ava';
import reducer, { initialState } from '../../app/src/js/reducers/stats';
import sinon from 'sinon';
import cloneDeep from 'lodash/cloneDeep';
import {
  STATS,
  STATS_INFLIGHT,
  STATS_ERROR,
  COUNT,
  COUNT_INFLIGHT,
  COUNT_ERROR
} from '../../app/src/js/actions/types';

test('verify initial state', (t) => {
  const newState = reducer(initialState, { data: {}, type: 'ANY_OTHER_TYPE' });
  t.deepEqual(newState, initialState);
});

test('stats', (t) => {
  const testStart = Date.now();
  sinon.useFakeTimers(testStart);

  const testState = cloneDeep(initialState);

  const data = { object: 'some data' };
  const action = {
    type: STATS,
    data
  };

  const expected = {
    ...testState,
    stats: {
      data: { ...data, queriedAt: testStart },
      inflight: false,
      error: null
    }
  };

  const actual = reducer(testState, action);
  t.deepEqual(expected, actual);
  sinon.restore();
});

test('stats_inflight', (t) => {
  const testState = cloneDeep(initialState);

  const action = { type: STATS_INFLIGHT };

  const expected = {
    ...testState, stats: { ...testState.stats, inflight: true }
  };

  const actual = reducer(testState, action);
  t.deepEqual(expected, actual);
});

test('stats_error', (t) => {
  const testState = cloneDeep(initialState);
  testState.stats.inflight = true;

  const action = { type: STATS_ERROR, error: 'an error' };

  const expected = {
    ...initialState, stats: { ...initialState.stats, inflight: false, error: 'an error' }
  };

  const actual = reducer(testState, action);
  t.deepEqual(expected, actual);
});

test('COUNT updates count for a requested type: granules replaces granules existing  ', (t) => {
  var id = null;
  var type = COUNT;
  var requestAction = {
    url: 'http://localhost:5001/stats/aggregate',
    params: {
      type: 'granules',
      field: 'status'
    }
  };
  var body = {
    count: [
      { key: 'completed', count: 6 },
      { key: 'failed', count: 2 },
      { key: 'running', count: 2 }
    ]
  };
  var action = { id, type, data: body, config: requestAction };
  var testState = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 96034 },
            { key: 'failed', count: 3293 },
            { key: 'running', count: 342 }
          ]
        }
      },
      inflight: false,
      error: null
    }
  };

  const expected = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 6 },
            { key: 'failed', count: 2 },
            { key: 'running', count: 2 }
          ]
        }
      },
      inflight: false,
      error: null
    }
  };

  var actual = reducer(testState, action);

  t.deepEqual(expected, actual);
});

test('COUNT adds a requested type: collections added to counts  ', (t) => {
  var id = null;
  var type = COUNT;
  var requestAction = {
    url: 'http://localhost:5001/stats/aggregate',
    params: {
      type: 'collections',
      field: 'status'
    }
  };
  var body = {
    count: [
      { key: 'completed', count: 60 },
      { key: 'failed', count: 12 },
      { key: 'running', count: 20 }
    ]
  };
  var action = { id, type, data: body, config: requestAction };
  var testState = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 6034 },
            { key: 'failed', count: 93 },
            { key: 'running', count: 41 }
          ]
        }
      },
      inflight: true,
      error: null
    }
  };

  const expected = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 6034 },
            { key: 'failed', count: 93 },
            { key: 'running', count: 41 }
          ]
        },
        collections: {
          count: [
            { key: 'completed', count: 60 },
            { key: 'failed', count: 12 },
            { key: 'running', count: 20 }
          ]
        }
      },
      inflight: false,
      error: null
    }
  };

  var actual = reducer(testState, action);

  t.deepEqual(expected, actual);
});

test('COUNT_INFLIGHT sets inflight to true.', (t) => {
  var id = null;
  var type = COUNT_INFLIGHT;
  var action = { id, type, data: {}, config: {} };
  var testState = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 6034 },
            { key: 'failed', count: 93 },
            { key: 'running', count: 41 }
          ]
        }
      },
      inflight: false,
      error: 'anything'
    }
  };

  var expected = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 6034 },
            { key: 'failed', count: 93 },
            { key: 'running', count: 41 }
          ]
        }
      },
      inflight: true,
      error: 'anything'
    }
  };
  var actual = reducer(testState, action);

  t.deepEqual(expected, actual);
});

test('COUNT_ERROR sets the error to the action error.', (t) => {
  var id = null;
  const type = COUNT_ERROR;
  const theError = 'An Error Occurred';
  var action = {id, type, error: theError};
  var testState = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 7 },
            { key: 'failed', count: 9 },
            { key: 'running', count: 0 }
          ]
        }
      },
      inflight: false,
      error: 'anything'
    }
  };

  var expected = {
    stats: {
      data: {},
      inflight: false,
      error: null
    },
    count: {
      data: {
        granules: {
          count: [
            { key: 'completed', count: 7 },
            { key: 'failed', count: 9 },
            { key: 'running', count: 0 }
          ]
        }
      },
      inflight: false,
      error: theError
    }
  };
  var actual = reducer(testState, action);

  t.deepEqual(expected, actual);
});
