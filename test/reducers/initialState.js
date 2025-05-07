'use strict';

import test from 'ava';
import { initialState } from '../../app/src/js/reducers/datepicker';
import config from '../../app/src/js/config';

test.serial('initialState defaults to Custom if unset or unrecognized', (t) => {
  
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
  
  config.initialDateRange = 'skibidy toilet';
  let state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
});

test.serial('initialState is based on INITIAL_DATE_RANGE environment variable', (t) => {
  config.initialDateRange = 'Custom';
  let state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });

  config.initialDateRange = '1';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 1, label: '1 day' });


  config.initialDateRange = '7';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 7, label: '1 week' });


  config.initialDateRange = '30';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 30, label: '1 month' });


  config.initialDateRange = '90';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 90, label: '3 months' });


  config.initialDateRange = '180';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 180, label: '6 months' });


  config.initialDateRange = '366';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 366, label: '1 year' });
  config.initialDateRange = 'Custom';
});

