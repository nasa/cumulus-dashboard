'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Home } from '../../../app/scripts/components/home';

configure({ adapter: new Adapter() });

test('CUMULUS-799 Home page contains distribution error report', async (t) => {
  const dist = {
    data: {
      errors: 52,
      successes: 43
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

  const metrics = home.find('#distMetrics li');
  t.is(metrics.length, 2);
  t.is(metrics.at(0).key(), 'Errors');
  t.is(metrics.at(1).key(), 'Successes');
  t.is(metrics.at(0).find('Link').dive().text(), '52 Errors');
  t.is(metrics.at(1).find('Link').dive().text(), '43 Successes');
});