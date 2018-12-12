import test from 'ava';
import { CALL_API } from '../../app/scripts/actions';
import { addRequestAuthMiddleware } from '../../app/scripts/middleware/auth';

test.beforeEach((t) => {
  const dispatchStub = () => {};
  const getStateStub = () => ({
    api: {
      tokens: {
        token: 'fake-token'
      }
    }
  });
  t.context.nextHandler = addRequestAuthMiddleware({dispatch: dispatchStub, getState: getStateStub});
});

test('should pass action to next if not an API request action', (t) => {
  const actionObj = {};

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, actionObj);
  });

  actionHandler(actionObj);
});

test('should properly add authorization headers to API request action', (t) => {
  const requestAction = {
    type: 'TEST',
    method: 'GET',
    url: 'http://localhost:5001/test-path'
  };
  const actionObj = {
    [CALL_API]: requestAction
  };

  const authRequestAction = Object.assign({}, requestAction, {
    headers: {
      Authorization: 'Bearer fake-token'
    }
  });
  const expectedAction = {
    [CALL_API]: authRequestAction
  };

  const actionHandler = t.context.nextHandler(action => {
    t.deepEqual(action, expectedAction);
  });

  actionHandler(actionObj);
});
