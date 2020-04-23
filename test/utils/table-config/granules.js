'use strict';

import test from 'ava';
import rewire from 'rewire';
import sinon from 'sinon';

const granules = rewire('../../../app/src/js/utils/table-config/granules');

const setOnConfirm = granules.__get__('setOnConfirm');

test.beforeEach((t) => {
  t.context.history = {};
  t.context.history.push = sinon.fake();
});

test.afterEach((t) => {
  sinon.restore();
});

test('setOnConfirm does nothing with an error', (t) => {
  const input = { history: t.context.history, error: true };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(t.context.history.push.notCalled);
});

test('setOnConfirm navigates to the target granule with a single selected granule', (t) => {
  const input = { history: t.context.history, selected: ['one-granule'] };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(t.context.history.push.calledWith('/granules/granule/one-granule'));
});

test('setOnConfirm navigates to the processing page with multiple selected granules', (t) => {
  const input = {
    history: t.context.history,
    selected: ['one-granule', 'two-granule']
  };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(t.context.history.push.calledWith('/granules/processing'));
});
