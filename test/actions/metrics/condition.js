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
const esRootUrl = (searchPath) => `https://example.com/${searchPath}/_search/`;

test.beforeEach((t) => {
  store.clearActions();
});

test('Each of the metrics actions will send a request to the correct ESROOT search endpoint', (t) => {
  const endpoints = [
    { action: 'DIST_APIGATEWAY_INFLIGHT', dispatcher: getDistApiGatewayMetrics, searchPath: 'cumulus-stack-cloudwatch*' },
    { action: 'DIST_API_LAMBDA_INFLIGHT', dispatcher: getDistApiLambdaMetrics, searchPath: 'cumulus-stack-cloudwatch*' },
    { action: 'DIST_S3ACCESS_INFLIGHT', dispatcher: getDistS3AccessMetrics, searchPath: 'cumulus-stack-s3*' },
    { action: 'DIST_TEA_LAMBDA_INFLIGHT', dispatcher: getTEALambdaMetrics, searchPath: 'cumulus-stack-cloudwatch*' },
  ];

  endpoints.forEach((e) => {
    store.dispatch(e.dispatcher(cumulusInstanceMeta));
    const dispatchedAction = store.getActions()[0];
    t.is(dispatchedAction.type, e.action);
    t.is(dispatchedAction.config.url, esRootUrl(e.searchPath));
    store.clearActions();
  });
});
