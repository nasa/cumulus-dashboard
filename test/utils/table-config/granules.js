'use strict';

import test from 'ava';
import sinon from 'sinon';
import cloneDeep from 'lodash.clonedeep';

import { __RewireAPI__ as GranulesRewireAPI } from '../../../app/src/js/utils/table-config/granules';

const setOnConfirm = GranulesRewireAPI.__get__('setOnConfirm');

GranulesRewireAPI.__Rewire__('historyPushWithQueryParams', sinon.fake());
const historyPushWithQueryParams = GranulesRewireAPI.__get__('historyPushWithQueryParams');

test.beforeEach((t) => {
  t.context.history = {};
  t.context.history.push = sinon.fake();
  t.context.history.location = { pathname: '/granules' };
});

test.afterEach((t) => {
  sinon.restore();
  GranulesRewireAPI.__ResetDependency__('historyPushWithQueryParams');
});

test('setOnConfirm does nothing with an error', (t) => {
  const input = { history: t.context.history, error: true };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(historyPushWithQueryParams.notCalled);
});

test('setOnConfirm navigates to the target granule with a single selected granule', (t) => {
  const input = { history: t.context.history, selected: ['one-granule'] };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(historyPushWithQueryParams.calledWith('/granules/granule/one-granule'));
});

test('setOnConfirm navigates to the processing page with multiple selected granules', (t) => {
  const input = {
    history: t.context.history,
    selected: ['one-granule', 'two-granule']
  };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();

  t.true(historyPushWithQueryParams.calledWith('/granules/processing'));
});

test('setOnConfirm calls setState to close the modal with multiple selected granules', (t) => {
  const input = {
    history: t.context.history,
    selected: ['one-granule', 'two-granule'],
    closeModal: sinon.fake()
  };
  const confirmCallback = setOnConfirm(input);

  confirmCallback();
  t.true(historyPushWithQueryParams.calledWith('/granules/processing'));
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
    t.true(historyPushWithQueryParams.calledWith(o.expected));
  });
});
