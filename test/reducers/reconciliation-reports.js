import test from 'ava';
import cloneDeep from 'lodash/cloneDeep.js';
import reducer, { initialState } from '../../app/src/js/reducers/reconciliation-reports.js';
import {
  RECONCILIATIONS
} from '../../app/src/js/actions/types.js';

test('RECONCILIATIONS reducer', function (t) {
  const reports = [
    { name: 'report-1' },
    { name: 'report-2' }
  ];
  const inputState = cloneDeep(initialState);
  const expected = cloneDeep(initialState);
  expected.list.data = reports;

  const action = {
    type: RECONCILIATIONS,
    data: {
      results: reports
    }
  };

  const actual = reducer(inputState, action);

  t.deepEqual(expected.list.data, actual.list.data);
});
