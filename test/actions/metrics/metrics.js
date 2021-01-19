import test from 'ava';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { requestMiddleware } from '../../../app/src/js/middleware/request';
import {
  getDistApiGatewayMetrics,
  getDistApiLambdaMetrics,
  getDistS3AccessMetrics,
  getTEALambdaMetrics,
} from '../../../app/src/js/actions';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  api: {
    tokens: {
      token: 'fake-token',
    },
  },
});
const cumulusInstanceMeta = { stackName: 'cumulus-stack' };

test.beforeEach((t) => {
  store.clearActions();
});

test('Each of the metrics actions will return NOOP when no ESROOT is specified', (t) => {
  store.dispatch(getDistApiGatewayMetrics(cumulusInstanceMeta));
  store.dispatch(getDistApiLambdaMetrics(cumulusInstanceMeta));
  store.dispatch(getDistS3AccessMetrics(cumulusInstanceMeta));
  store.dispatch(getTEALambdaMetrics(cumulusInstanceMeta));
  const dispatchedActions = store.getActions();
  const expectedActions = [
    {
      type: 'NOOP',
    },
    {
      type: 'NOOP',
    },
    {
      type: 'NOOP',
    },
    {
      type: 'NOOP',
    }
  ];
  t.deepEqual(dispatchedActions, expectedActions);
});
