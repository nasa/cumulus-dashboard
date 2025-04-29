'use strict';

import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { render } from '@testing-library/react'
import { listGranules } from '../../../app/src/js/actions';
import { List } from '../../../app/src/js/components/Table/Table';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { errorTableColumns } from '../../../app/src/js/utils/table-config/granules';

test('table should properly initialize timer config prop', async (t) => {
  const dispatch = () => Promise.resolve();
  const query = { error__exists: true, status: 'failed' };
  const list = {
    meta: {},
    data: [],
  };

  const urlHelper = {
    queryParams: {},
    location: {},
    navigate: () => {},
    params: {},
    isAuthenticated: true,
    routerState: { location: {} },
    dispatch: () => {},
    historyPushWithQueryParams: () => {},
    getPersistentQueryParams: () => '',
    getInitialValueFromLocation: () => '',
    initialValuesFromLocation: () => ({}),
    filterQueryParams: () => ({})
  };

  const middlewares = [requestMiddleware, thunk];
  const mockStore = configureMockStore(middlewares);
  const someStore = mockStore({
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    api: { authenticated: true },
    router: { location: {}, action: 'POP' }
  });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter>
        <List
          list={list}
          dispatch={dispatch}
          action={listGranules}
          tableColumns={errorTableColumns}
          initialSortId="updatedAt"
          query={query}
          queryParams={{}}
          urlHelper={urlHelper}
        />
      </MemoryRouter>
    </Provider>,
    {
      // We must disable lifecycle methods so that when we find the Timer its
      // properties will still be set to their initial values.  Otherwise, a
      // lifecycle method might cause the properties to change and we will not
      // be able to check their initial values, which is what we want to do.
      disableLifecycleMethods: true,
    }
  );

  const timerWrapper = container.querySelectorAll('.form__element__updateToggle'); // timer class name
  t.is(timerWrapper.length, 1);

  t.truthy(timerWrapper[0], 'Timer not found');
  // Is the Timer's query configuration properly initialized via the
  // enclosing List's state, prior to any lifecycle method invocations?
  t.is(timerWrapper[0].config, query.q);
});
