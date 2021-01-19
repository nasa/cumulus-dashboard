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
  datepicker: {
    endDateTime: null,
    startDateTime: null
  }
});
const cumulusInstanceMeta = { stackName: 'cumulus-stack' };
const esRootUrl = 'https://example.com/_search/';

test.beforeEach((t) => {
  store.clearActions();
});

test('Each of the metrics actions will send a request to the provided ESROOT', (t) => {
  const endpoints = [
    { action: 'DIST_APIGATEWAY_INFLIGHT', dispatcher: getDistApiGatewayMetrics },
    { action: 'DIST_API_LAMBDA_INFLIGHT', dispatcher: getDistApiLambdaMetrics },
    { action: 'DIST_S3ACCESS_INFLIGHT', dispatcher: getDistS3AccessMetrics },
    { action: 'DIST_TEA_LAMBDA_INFLIGHT', dispatcher: getTEALambdaMetrics },
  ];

  endpoints.forEach((e) => {
    store.dispatch(e.dispatcher(cumulusInstanceMeta));
    const dispatchedAction = store.getActions()[0];
    t.is(dispatchedAction.type, e.action);
    t.is(dispatchedAction.config.url, esRootUrl);
    store.clearActions();
  });
});