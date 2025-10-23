'use strict';

import test from 'ava';
import React from 'react';
import { Provider } from 'react-redux';
import GranulesOverview from '../../../app/src/js/components/Granules/overview';
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';

const granules = {
  list: {
    meta: {
      count: 12,
      queriedAt: 0
    }
  },
  map: {
    'my-granule-id': {
      data: {
        name: 'my-name',
        filename: 'my-filename',
        bucket: 'my-bucket',
        status: 'success',
        files: [
          {
            fileName: 'my-name',
            key: 'my-key-path/my-name',
            bucket: 'my-bucket'
          }
        ]
      }
    }
  },
  bulk: {
    bulkOpRequestId: 'my-bulk-op-request-request',
  }
};

const workflowOptions = [];
const collections = {};
const providers = {};
const stats = { count: 0, stats: {} };
const dispatch = () => {};
const locationQueryParams = {search: {} }
const granulesExecutions = {
  workflows: {
    data: ['fakeworkflow1', 'fakeworkflow2']
  }
};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

test('GranulesOverview generates bulkAction for recovery button', function (t) {
  const configWithRecovery = { enableRecovery: true };
  const someStore = mockStore({
    sorts: {},
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    locationQueryParams: locationQueryParams,
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {},
    granules,
    config: configWithRecovery,
    granulesExecutions,
    granules: granules,
    stats: stats,
    workflowOptions: workflowOptions,
    collections: collections,
    location: location,
    providers: providers
  });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/granules']}>
        <GranulesOverview/>
      </MemoryRouter>
    </Provider>);

  const listBulkActions = container.querySelectorAll('button');

  const recoverFilter = (object) => object.textContent === 'Recover Granule';
  const recoverActionList = Array.from(listBulkActions).filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});


test('GranulesOverview does not generate bulkAction for recovery button', function (t) {
  const config = { enableRecovery: false };
  const someStore = mockStore({
    sorts: {},
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    locationQueryParams: locationQueryParams,
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {},
    granules,
    config,
    granulesExecutions,
    granules: granules,
    stats: stats,
    workflowOptions: workflowOptions,
    collections: collections,
    location: location,
    providers: providers
  });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/granules']}>
        <GranulesOverview/>
      </MemoryRouter>
    </Provider>);

  const listBulkActions = container.querySelectorAll('button');

  const recoverFilter = (object) => object.textContent === 'Recover Granule';
  const recoverActionList = Array.from(listBulkActions).filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});

test('GranulesOverview generates Granule Inventory List button', function (t) {
  const someStore = mockStore({
    sorts: {},
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    locationQueryParams: locationQueryParams,
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {},
    granules,
    config: { enableRecovery: true },
    granulesExecutions,
    granules: granules,
    stats: stats,
    workflowOptions: workflowOptions,
    collections: collections,
    location: location,
    providers: providers
  });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/granules']}>
        <GranulesOverview/>
      </MemoryRouter>
    </Provider>);

  const listBulkActions = container.querySelectorAll('button');

  const recoverFilter = (object) => object.className.includes('csv__download');
  const granuleInventoryActionList = Array.from(listBulkActions).filter(recoverFilter);
  t.is(granuleInventoryActionList.length, 1);
});
