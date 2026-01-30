'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
import React from 'react';

import { BatchReingestConfirmContent,
  maxDisplayed
} from '../../../app/src/js/components/ReingestGranules/BatchReingestConfirmContent';

const granulesExecutions = {
  workflows: {
    data: ['fakeworkflow1', 'fakeworkflow2']
  }
};

const dispatch = () => {};

test('Renders successful results with multiple granules', (t) => {
  const selected = ['granule-a', 'granule-b'];

  const { container } = render(
    <BatchReingestConfirmContent
      dispatch={dispatch}
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(container.textContent.includes('Selected granules:'));
  t.true(container.textContent.includes('Below you can select a specific workflow to apply to the selected granules.'));
  t.falsy(container.textContent.match('and.*more.'));
  t.is(container.querySelector('ul').children.length, 2);
});


test('Renders successful results with a single granule', (t) => {
  const selected = ['granule-a'];

  const { container } = render(
    <BatchReingestConfirmContent
      dispatch={dispatch}
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(container.textContent.includes('Selected granule:'));
  t.true(container.textContent.includes('Below you can select a specific workflow to apply to the selected granule.'));
  t.falsy(container.textContent.match('and.*more.'));
  t.is(container.querySelector('ul').children.length, 1);
});

test('Abbreviates when number selected is greater than the maxDisplayed', (t) => {
  const selected = Array.from(Array(maxDisplayed + 5).keys()).map(
    (t) => (`granule-${t}`)
  );

  const { container } = render(
    <BatchReingestConfirmContent
      dispatch={dispatch}
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(container.textContent.includes('Selected granules:'));
  t.true(container.textContent.includes('Below you can select a specific workflow to apply to the selected granules.'));
  t.true(container.textContent.includes('and 5 more.'));
  t.is(container.querySelector('ul').children.length, maxDisplayed + 1);
});
