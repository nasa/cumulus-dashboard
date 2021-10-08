'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { BatchReingestConfirmContent,
  maxDisplayed
} from '../../../app/src/js/components/ReingestGranules/BatchReingestConfirmContent';

configure({ adapter: new Adapter() });

const granulesExecutions = {
  workflows: {
    data: ['fakeworkflow1', 'fakeworkflow2']
  }
};

test('Renders successful results with multiple granules', (t) => {
  const selected = [
    { granuleId: 'granule-a', collectionId: 'collection-a'},
    { granuleId: 'granule-b', collectionId: 'collection-b'},
  ];

  const wrapper = shallow(
    <BatchReingestConfirmContent
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(wrapper.text().includes('Selected granules:'));
  t.true(wrapper.text().includes('Below you can select a specific workflow to apply to the selected granules.'));
  t.falsy(wrapper.text().match('and.*more.'));
  t.is(wrapper.find('ul').children().length, 2);
});

test('Renders successful results with a single granule', (t) => {
  const selected = [
    { granuleId: 'granule-a', collectionId: 'collection-a'},
  ];

  const wrapper = shallow(
    <BatchReingestConfirmContent
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(wrapper.text().includes('Selected granule:'));
  t.true(wrapper.text().includes('Below you can select a specific workflow to apply to the selected granule.'));
  t.falsy(wrapper.text().match('and.*more.'));
  t.is(wrapper.find('ul').children().length, 1);
});

test('Abbreviates when number selected is greater than the maxDisplayed', (t) => {
  const selected = Array.from(Array(maxDisplayed + 5).keys()).map(
    (t) => ({ granuleId: `granule-${t}`, collectionId: `collection-${t}` })
  );

  const wrapper = shallow(
    <BatchReingestConfirmContent
      selected={selected}
      granulesExecutions={granulesExecutions}
    />);

  t.true(wrapper.text().includes('Selected granules:'));
  t.true(wrapper.text().includes('Below you can select a specific workflow to apply to the selected granules.'));
  t.true(wrapper.text().includes('and 5 more.'));
  t.is(wrapper.find('ul').children().length, maxDisplayed + 1);
});
