'use strict';

import test from 'ava';
import sinon from 'sinon';

import { updateRouterLocation } from '../../app/src/js/utils/url-helper';

const sandbox = sinon.createSandbox();
test.beforeEach((t) => {
  t.context.fake = sandbox.fake();
  t.context.location = {
    pathname: '/granules',
    action: 'PUSH',
    key: 'fsz1dg',
    query: {}
  };
});

test.afterEach((t) => {
  sandbox.restore();
});

test('pushes a new location when changed.', (t) => {
  const router = { push: t.context.fake };
  const paramKey = 'status';
  const value = 'running';

  const expectedCalledWith = { ...t.context.location };
  expectedCalledWith.query = { status: 'running' };

  updateRouterLocation(router, t.context.location, paramKey, value);

  t.true(t.context.fake.calledWith(expectedCalledWith));
});

test('pushes removes a query if value is blank ', (t) => {
  const router = { push: t.context.fake };
  const paramKey = 'status';
  const value = '';
  const inputLoc = { ...t.context.location };
  inputLoc.query = { status: 'running' };
  const expectedCalledWith = { ...t.context.location };
  expectedCalledWith.query = {};

  updateRouterLocation(router, inputLoc, paramKey, value);

  t.true(t.context.fake.calledWith(expectedCalledWith));
});

test('Does not update router if query is unchanged.', (t) => {
  const router = { push: t.context.fake };
  const paramKey = 'status';
  const value = 'running';
  const inputLoc = { ...t.context.location };
  inputLoc.query = { status: 'running' };

  updateRouterLocation(router, inputLoc, paramKey, value);

  t.true(t.context.fake.notCalled);
});
