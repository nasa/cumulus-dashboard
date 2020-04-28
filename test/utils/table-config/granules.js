'use strict';

import test from 'ava';
import rewire from 'rewire';
import sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';

const granules = rewire('../../../app/src/js/utils/table-config/granules');

const setOnConfirm = granules.__get__('setOnConfirm');

test.beforeEach((t) => {
  t.context.history = {};
  t.context.history.push = sinon.fake();
  t.context.history.location = { pathname: '/granules' };
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

test('setOnConfirm calls setState to close the modal with multiple selected granules', (t) => {
  const input = {
    history: t.context.history,
    selected: ['one-granule', 'two-granule'],
    closeModal: sinon.fake()
  };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();
  t.true(t.context.history.push.calledWith('/granules/processing'));
  t.true(input.closeModal.called);
});

test('setOnConfirm navigates to the correct processing page irrespective of the current location.', (t) => {
  const input = {
    history: t.context.history,
    selected: ['one-granule', 'two-granule']
  };

  const locationExpects = [
    {
      pathname: 'collections/collection/MOD09GQ/006/granules/completed',
      expected: 'collections/collection/MOD09GQ/006/granules/processing'
    },
    {
      pathname: 'collections/collection/MOD09GQ/006/granules/processing',
      expected: 'collections/collection/MOD09GQ/006/granules/processing'
    },
    {
      pathname: 'collections/collection/MOD09GQ/006',
      expected: 'collections/collection/MOD09GQ/006/granules/processing'
    },
    {
      pathname: 'collections/collection/MOD09GQ/006/granules',
      expected: 'collections/collection/MOD09GQ/006/granules/processing'
    },
    {
      pathname: '/granules/completed',
      expected: '/granules/processing'
    }
  ];

  locationExpects.forEach((o) => {
    const testInput = cloneDeep(input);
    testInput.history.location.pathname = o.pathname;
    const confirmCallback = setOnConfirm(testInput);
    confirmCallback();
    t.true(t.context.history.push.calledWith(o.expected));
  });
});
