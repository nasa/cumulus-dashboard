'use strict';

import test from 'ava';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { listGranules } from '../../../app/src/js/actions';
import { List } from '../../../app/src/js/components/Table/Table';
import Timer from '../../../app/src/js/components/Timer/timer.js';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { errorTableColumns } from '../../../app/src/js/utils/table-config/granules';

configure({ adapter: new Adapter() });

test('table should properly initialize timer config prop', async (t) => {
  const dispatch = () => Promise.resolve();
  const query = { error__exists: true, status: 'failed' };
  const list = {
    meta: {},
    data: [],
  };

  const middlewares = [requestMiddleware, thunk];
  const mockStore = configureMockStore(middlewares);
  const someStore = mockStore({
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
  });

  const providerWrapper = shallow(
    <Provider store={someStore}>
      <List
        list={list}
        dispatch={dispatch}
        action={listGranules}
        tableColumns={errorTableColumns}
        initialSortId="timestamp"
        query={query}
        queryParams={{}}
      />
    </Provider>,
    {
      // We must disable lifecycle methods so that when we find the Timer its
      // properties will still be set to their initial values.  Otherwise, a
      // lifecycle method might cause the properties to change and we will not
      // be able to check their initial values, which is what we want to do.
      disableLifecycleMethods: true,
    }
  );

  const listWrapper = providerWrapper.find('List').dive();
  const listActionsWrapper = listWrapper.find('ListActions').dive();
  const timerWrapper = listActionsWrapper.find(Timer);
  t.is(timerWrapper.length, 1);

  t.truthy(timerWrapper.exists(), 'Timer not found');
  // Is the Timer's query configuration properly initialized via the
  // enclosing List's state, prior to any lifecycle method invocations?
  t.is(timerWrapper.props().config.q, query.q);
});
