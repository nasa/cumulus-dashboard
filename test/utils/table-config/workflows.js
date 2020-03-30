'use strict';

import test from 'ava';
import cloneDeep from 'lodash.clonedeep';
import { makeSteps } from '../../../app/src/js/utils/table-config/workflows';

const sampleRow = {
  'arn': 'arn:aws:states:us-east-1:0123456789012:stateMachine:mhs3-HelloWorldFailWorkflow',
  'definition': {
    'Comment': 'Failing Hello World Workflow',
    'States': {
      'HelloWorld': { },
      'GoodbyeWorld': { }
    }
  },
  'name': 'HelloWorldFailWorkflow'
};

test('makeSteps builds steps if steps are available', (t) => {
  const expected = 'HelloWorld, GoodbyeWorld';
  const actual = makeSteps(sampleRow);

  t.is(expected, actual);
});

test('makeSteps returns empty string if no steps are available', (t) => {
  const testRow = cloneDeep(sampleRow);
  testRow.definition.States = {};
  const expected = '';
  const actual = makeSteps(testRow);

  t.is(expected, actual);
});

test('makeSteps returns empty string if description is not available', (t) => {
  const testRow = cloneDeep(sampleRow);
  delete testRow.definition;
  const expected = '';
  const actual = makeSteps(testRow);

  t.is(expected, actual);
});
