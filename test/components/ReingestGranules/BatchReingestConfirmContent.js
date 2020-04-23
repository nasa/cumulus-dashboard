'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import BatchReingestConfirmContent, {
  maxDisplayed
} from '../../../app/src/js/components/ReingestGranules/BatchReingestConfirmContent';

configure({ adapter: new Adapter() });

test('Renders successful results with multiple granules', (t) => {
  const selected = ['granule-a', 'granule-b'];

  const wrapper = shallow(<BatchReingestConfirmContent selected={selected} />);

  t.true(
    wrapper
      .text()
      .includes(
        'You have submitted a request to reingest the following granules.'
      )
  );
  t.true(wrapper.text().includes('you want to reingest these granules?'));
  t.falsy(wrapper.text().match('and.*more.'));
  t.is(wrapper.find('ul').children().length, 2);
});

test('Renders successful results with a single granule', (t) => {
  const selected = ['granule-c'];

  const wrapper = shallow(<BatchReingestConfirmContent selected={selected} />);

  t.true(
    wrapper
      .text()
      .includes(
        'You have submitted a request to reingest the following granule.'
      )
  );
  t.true(wrapper.text().includes('you want to reingest this granule?'));
  t.falsy(wrapper.text().match('and.*more.'));
  t.is(wrapper.find('ul').children().length, 1);
});

test('Abbreviates when number selected is greater than the maxDisplayed', (t) => {
  const selected = Array.from(Array(maxDisplayed + 5).keys()).map(
    (t) => `granule-${t}`
  );

  const wrapper = shallow(<BatchReingestConfirmContent selected={selected} />);

  t.true(
    wrapper
      .text()
      .includes(
        'You have submitted a request to reingest the following granules.'
      )
  );
  t.true(wrapper.text().includes('you want to reingest these granules?'));
  t.true(wrapper.text().includes('and 5 more.'));
  t.is(wrapper.find('ul').children().length, maxDisplayed + 1);
});
