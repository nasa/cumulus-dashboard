'use strict';

import test from 'ava';
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import React from 'react';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';
import { CollectionList } from '../../../app/src/js/components/Collections/list';

const collections = {
  created: {},
  deleted: {},
  list: {
    data: [
      { name: 'https_testcollection', version: '001', createdAt: 0 }
    ],
    meta: {
      count: 0,
      queriedAt: 0
    },
  },
  map: {},
  updated: {}
};

const providers = {
  providers: {
    list: {
      data: [],
      meta: {},
      params: {}
    },
    dropdowns: {
      provider: {
        options: [
          {
            id: 's3_provider',
            label: 's3_provider'
          },
          {
            id: 'http_provider',
            label: 'http_provider'
          }
        ],
      }
    }
  }
};

const dispatch = () => {};
const logs = {};
const locationQueryParams = {
  search: {}
};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  getState: () => {},
  dispatch,
  subscribe: () => {},
  sorts: {},
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams,
});

test('Collections Overview generates bulkAction for recovery button', function (t) {
  const config = { enableRecovery: true };
  const {container} = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <CollectionList
      collections={collections}
      dispatch={dispatch}
      logs={logs}
      config={config}
      providers={providers}
    />
    </MemoryRouter>
    </Provider>
  );

  const bulkActions = container.querySelectorAll('button');

  const recoverFilter = (object) => object.textContent === 'Recover';
  const recoverActionList = Array.from(bulkActions).filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});

test('Collections Overview does not generate bulkAction for recovery button', function (t) {
  const config = { enableRecovery: false };
  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <CollectionList
      collections={collections}
      dispatch={dispatch}
      logs={logs}
      config={config}
      providers={providers}
    />
    </MemoryRouter>
    </Provider>
  );

  const bulkActions = container.querySelectorAll('button');

  const recoverFilter = (object) => object.textContent === 'Recover';
  const recoverActionList = Array.from(bulkActions).filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});
