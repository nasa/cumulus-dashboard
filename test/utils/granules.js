'use strict';
import test from 'ava';
import { recoverAction } from '../../app/scripts/utils/table-config/granules';
import { recoverGranule } from '../../app/scripts/actions';

const granules = {
  recovered: 'recovered'
};

test('recoverAction returns an empty list when disabled', function (t) {
  const response = recoverAction(granules, true);
  t.is(response, []);
});

test('recoverAction returns a javascript object when disabled is false', function (t) {
  const response = recoverAction(granules, false);
  t.is(response.text, 'Recover Granule');
  t.is(response.state, granules.recovered);
  t.is(response.action, recoverGranule);
});
