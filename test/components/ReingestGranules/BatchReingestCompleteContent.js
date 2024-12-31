'use strict';

import test from 'ava';
import { render } from '@testing-library/react'
import React from 'react';

import BatchReingestComplete, {
  maxDisplayed
} from '../../../app/src/js/components/ReingestGranules/BatchReingestCompleteContent';

const errors = [
  {
    id: '',
    error: `Execution Does Not Exist: 'arn:aws:states:us-east-1:123456789012:execution:TestStateMachine-Rcei43QwgSP6:bab9c234-e492-40e6-a34c-a0f76a4c7968'; Function params: [
      {
        "executionArn": "arn:aws:states:us-east-1:123456789012:execution:TestStateMachine-Rcei43QwgSP6:bab9c234-e492-40e6-a34c-a0f76a4c7968"
      }
    ]`
  }
];

test('Renders Error result', (t) => {
  const { container } = render(
    <BatchReingestComplete results={[]} errors={errors} />
  );

  const errorWrapper = container.querySelectorAll('.Collapsible__contentInner');
  t.true(errorWrapper[0].textContent.includes(errors[0].error));
});

test('Renders success results with multiple Granules', (t) => {
  const results = ['granule-1', 'granule-2'];
  const { container } = render(
    <BatchReingestComplete results={results} error={undefined} />
  );

  t.true(container.innerHTML.includes('successfully reingested these granules'));
  t.is(container.querySelector('ul').children.length, 2);
});

test('Renders success results with a single granule', (t) => {
  const results = ['granule-1'];
  const { container } = render(
    <BatchReingestComplete results={results} error={undefined} />
  );

  t.true(container.innerHTML.includes('successfully reingested this granule'));
  t.is(container.querySelector('ul').children.length, 1);
  t.falsy(container.innerHTML.match('and.* more'));
});

test('Limits success results with a many granules', (t) => {
  const results = Array.from(Array(maxDisplayed + 5).keys()).map(
    (t) => `granule-${t}`
  );

  const { container } = render(
    <BatchReingestComplete results={results} error={undefined} />
  );

  t.true(container.innerHTML.includes('successfully reingested these granules'));
  t.is(container.querySelector('ul').children.length, maxDisplayed + 1);
  t.true(container.innerHTML.includes('and 5 more'));
});
