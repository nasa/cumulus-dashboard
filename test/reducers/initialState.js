'use strict';

import test from 'ava';
import { initialState } from '../../app/src/js/reducers/datepicker';
test.serial('initialState is based on INITIAL_DATE_RANGE environment variable', (t) => {
  process.env.INITIAL_DATE_RANGE = 'Recent';
  let state = initialState();
  t.deepEqual(state.dateRange, { value: 'Recent', label: 'Recent' });

  process.env.INITIAL_DATE_RANGE = 'Custom';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });

  process.env.INITIAL_DATE_RANGE = '1';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 1, label: '1 day' });


  process.env.INITIAL_DATE_RANGE = '7';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 7, label: '1 week' });


  process.env.INITIAL_DATE_RANGE = '30';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 30, label: '1 month' });


  process.env.INITIAL_DATE_RANGE = '90';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 90, label: '3 months' });


  process.env.INITIAL_DATE_RANGE = '180';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 180, label: '6 months' });


  process.env.INITIAL_DATE_RANGE = '366';
  state = initialState();
  t.deepEqual(state.dateRange, { value: 366, label: '1 year' });
  delete process.env.INITIAL_DATE_RANGE;
});

test.serial('initialState defaults to Custom if unset or unrecognized', (t) => {
  process.env.INITIAL_DATE_RANGE = 'skibidy toilet';
  let state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
  
  delete process.env.INITIAL_DATE_RANGE;
  state = initialState();
  t.deepEqual(state.dateRange, { value: 'Custom', label: 'Custom' });
});
