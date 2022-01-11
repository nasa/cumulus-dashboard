'use strict';
import React from 'react';
import test from 'ava';
import cloneDeep from 'lodash/cloneDeep';
import { buildLink, makeSteps } from '../../../app/src/js/utils/table-config/workflows';
import _config from '../../../app/src/js/config';

_config.awsRegion = 'us-testRegion-1';

const sampleRow = {
  arn: 'samplerow-arn',
  definition: {
    Comment: 'Description of workflow.',
    States: {
      HelloWorld: { },
      GoodbyeWorld: { }
    }
  },
  name: 'workflowName'
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

test('buildLink returns link to ARN if available', (t) => {
  const testRow = cloneDeep(sampleRow);

  const expected = <a
    target="_blank"
    href="https://console.aws.amazon.com/states/home?region=us-testRegion-1#/statemachines/view/samplerow-arn">
    Description of workflow.
  </a>;
  const actual = buildLink(testRow);
  t.deepEqual(expected, actual);
});

test('buildLink uses default title if description is not available', (t) => {
  const testRow = cloneDeep(sampleRow);
  delete testRow.definition.Comment;

  const expected = <a
    target="_blank"
    href="https://console.aws.amazon.com/states/home?region=us-testRegion-1#/statemachines/view/samplerow-arn">
    AWS Stepfunction
  </a>;
  const actual = buildLink(testRow);
  t.deepEqual(expected, actual);
});

test('buildLink returns just a description if no ARN.', (t) => {
  const testRow = cloneDeep(sampleRow);
  delete testRow.arn;

  const expected = 'Description of workflow.';
  const actual = buildLink(testRow);
  t.deepEqual(expected, actual);
});

test('buildLink returns null if no ARN and no description', (t) => {
  const testRow = cloneDeep(sampleRow);
  delete testRow.arn;
  delete testRow.definition.Comment;

  const expected = null;
  const actual = buildLink(testRow);
  t.is(expected, actual);
});
