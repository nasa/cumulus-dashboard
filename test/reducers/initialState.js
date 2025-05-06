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
  config.initialDateRange = 'Recent';
  let state = initialState();
  t.deepEqual(state.dateRange, { value: 'Recent', label: 'Recent' });
  config.initialDateRange = 'Custom';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });

  config.initialDateRange = '1';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 1, label: '1 day' });


  config.initialDateRange = '7';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 7, label: '7 days' });


  config.initialDateRange = '30';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 30, label: '30 days' });


  config.initialDateRange = '35';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 35, label: '35 days' });

  config.initialDateRange = 'Custom';
});
