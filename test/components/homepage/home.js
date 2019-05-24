'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/scripts/components/home';

configure({ adapter: new Adapter() });

test('CUMULUS-799 Home page contains distribution error report', async (t) => {
  const dist = {
    dist: {
      data: {
        errors: 52,
        successes: 43
      }
    }
  };
  const granules = { list: [] };
  const stats = {
    stats: {
      data: {}
    },
    count: {
      data: {}
    }
  };
  const dispatch = () => {};

  const home = shallow(<Home
    dispatch={dispatch} 
    dist={dist}
    granules={granules}
    stats={stats}
    />);

  t.is(home.find('#distMetric').length, 2);
});