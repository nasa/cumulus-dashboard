'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import {mount, configure} from 'enzyme';
import {listGranules} from '../../../app/src/js/actions';
import { List } from '../../../app/src/js/components/Table/Table';
import Timer from '../../../app/src/js/components/Timer/timer.js';
import { errorTableColumns } from '../../../app/src/js/utils/table-config/granules';

configure({ adapter: new Adapter() });

test('table should properly initialize timer config prop', async (t) => {
  const dispatch = () => Promise.resolve();
  const query = { error__exists: true, status: 'failed' };
  const list = {
    meta: {},
    data: []
  };
  const listWrapper = mount(
    <List
      list={list}
      dispatch={dispatch}
      action={listGranules}
      tableColumns={errorTableColumns}
      sortIdx='timestamp'
      query={query}
    />,
    {
      // We must disable lifecycle methods so that when we find the Timer its
      // properties will still be set to their initial values.  Otherwise, a
      // lifecycle method might cause the properties to change and we will not
      // be able to check their initial values, which is what we want to do.
      disableLifecycleMethods: true,
      context: {
        store: {
          subscribe: () => void 0,
          dispatch: () => void 0,
          getState: () => void 0
        }
      }
    }
  );

  const timerWrapper = listWrapper.find(Timer);

  t.truthy(timerWrapper.exists(), 'Timer not found');
  // Is the Timer's query configuration properly initialized via the
  // enclosing List's state, prior to any lifecycle method invocations?
  t.is(timerWrapper.props().config.q, query.q);
  listWrapper.unmount();
});
