'use strict';

import test from 'ava';
import { initialState } from '../../app/src/js/reducers/datepicker';
import config from '../../app/src/js/config';
import { msPerDay } from '../../app/src/js/utils/datepicker';

test.serial('initialState defaults to Custom if unset or unrecognized', (t) => {

  config.initialDateRange = 'All';
  let state = initialState();
  t.deepEqual(state, {
    dateRange: {
      value: 'Custom',
      label: 'Custom',
    },
    hourFormat: '12HR',
    endDateTime: null,
    startDateTime: null,
  });

  config.initialDateRange = 'skibidy toilet';
  state = initialState();
  t.deepEqual(state, {
    dateRange: {
      value: 'Custom',
      label: 'Custom',
    },
    hourFormat: '12HR',
    endDateTime: null,
    startDateTime: null,
  });
});

test.serial('initialState is based on INITIAL_DATE_RANGE_IN_DAYS environment variable', (t) => {
  config.initialDateRange = 'Custom';
  let state = initialState();
  t.deepEqual(state, {
    dateRange: {
      value: 'Custom',
      label: 'Custom',
    },
    hourFormat: '12HR',
    endDateTime: null,
    startDateTime: null,
  });

  config.initialDateRange = '1';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
  t.true(state.startDateTime <= Date.now() - 1 * msPerDay);
  t.true(state.endDateTime <= Date.now() * msPerDay);

  config.initialDateRange = '365';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
  t.true(state.startDateTime <= Date.now() - 365 * msPerDay);
  t.true(state.endDateTime <= Date.now() * msPerDay);

  config.initialDateRange = '12';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
  t.true(state.startDateTime <= Date.now() - 12 * msPerDay);
  t.true(state.endDateTime <= Date.now() * msPerDay);
});

