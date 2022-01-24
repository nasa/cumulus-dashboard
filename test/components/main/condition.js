'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { Main } from '../../../app/src/js/main';

configure({ adapter: new Adapter() });

test('Main wrapper displays STAGE and ENVIRONMENT variables', function (t) {
  const dispatch = () => {};

  const main = shallow(<Main dispatch={dispatch} />);

  const appTarget = main.find('.app__target');
  t.is(appTarget.length, 1);
  t.is(appTarget.text(), 'Cumulus_daac (Production)');
});
