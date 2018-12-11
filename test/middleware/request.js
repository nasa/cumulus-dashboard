import test from 'ava';
import nock from 'nock';
import { CALL_API } from '../../app/scripts/actions';
import { doRequestMiddleware } from '../../app/scripts/middleware/request';

test.beforeEach((t) => {
  const doDispatch = () => {};
  const doGetState = () => {};
  t.context.nextHandler = doRequestMiddleware({dispatch: doDispatch, getState: doGetState});
});

test('should pass action to next if not an API request action', (t) => {
  const actionObj = {};

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, actionObj);
  });

  actionHandler(actionObj);
});

test.cb.only('should make GET request for API request action', (t) => {
  const stubbedResponse = { message: 'success' };
  nock('http://localhost:5001')
    .get('/test-path')
    .reply(200, stubbedResponse);

  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const expectedAction = {
    id: undefined,
    config: requestAction,
    type: 'TEST',
    data: stubbedResponse
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
    t.end();
  });

  actionHandler(actionObj);
});
