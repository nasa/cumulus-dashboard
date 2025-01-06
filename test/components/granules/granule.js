'use strict';

import test from 'ava';
import React from 'react';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

import { GranuleOverview } from '../../../app/src/js/components/Granules/granule.js';

const logs = { items: [''] };

// const match = { params: { granuleId: 'my-granule-id' } }; // removed because useParams hook now
const dispatch = () => {};
const granules = {
  map: {
    'my-granule-id': {
      data: {
        granuleId: 'my-granule-id',
        name: 'my-name',
        filename: 'my-filename',
        bucket: 'my-bucket',
        status: 'success',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: [
          {
            fileName: 'my-name',
            key: 'my-key-path/my-name',
            bucket: 'my-bucket',
            size:  10239,
            type: 'data',
          }
        ]
      },
      error: null,
      inflight: false,
    },
    reprocessed: {},
    reingested: {},
    executed: {},
    removed: {},
    deleted: {}
  }
};

const recoveryStatus = {
  map: {
    'my-granule-id': {
      error: null
    }
  }
};

const executions = {
  map: {
    'my-granule-id': {
      data: [
        {
          type: 'workflow1',
          arn: 'arn:aws:states:us-east-1:123456789012:execution:my-granule-id:1',
        },
        {
          type: 'workflow2',
          arn: 'arn:aws:states:us-east-1:123456789012:execution:my-granule-id:2',
        }
      ],
      error: null
    }
  }
};

const locationQueryParams = {
  search: {}
};

const urlHelper = {
  queryParams: {},
  location: {},
  navigate: () => {},
  params: {},
  isAuthenticated: true,
  routerState: { location: {} },
  dispatch,
  historyPushWithQueryParams: () => {},
  getPersistentQueryParams: () => '',
  getInitialValueFromLocation: () => '',
  initialValuesFromLocation: () => ({}),
  filterQueryParams: () => ({})
};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  api: { authenicated: true},
  router: {location: {}, action: 'POP'},
  getState: () => {},
  dispatch,
  subscribe: () => {},
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams,
  logs,
  granules,
  recoveryStatus,
  executions,
  config: { enableRecovery: true, filesTableColumns: {} },
});

test.beforeEach((t) => {
  // Mock useDispatch hook to return a function that returns a Promise
  const mockDispatch = (action) => {
    if (action.type === 'GET_GRANULE') {
      return Promise.resolve({
        data: {
          granuleId: 'my-granule-id',
          name: 'my-name',
          filename: 'my-filename',
          bucket: 'my-bucket',
          status: 'success',
          files: [
            {
              fileName: 'my-name',
              key: 'my-key-path/my-name',
              bucket: 'my-bucket',
              size: 10239
            }
          ]
        }
      });
    }
    if (action.type === 'LIST_EXECUTIONS') {
      return Promise.resolve({
        data: {
          results: []
        }
      });
    }
    return Promise.resolve({
      data: {}
    });
  };

  sinon.stub(redux, "useDispatch").returns(mockDispatch);
});

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('CUMULUS-336 Granule file links use the correct URL', function (t) {

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/granules/my-granule-id']}>
        <Routes>
          <Route path="/granules/:granuleId" element={
            <GranuleOverview
              dispatch={dispatch}
              executions={executions}
              granules={granules}
              logs={logs}
              recoveryStatus={recoveryStatus}
              skipReloadOnMount={true}
              workflowOptions={[]}
              urlHelper={urlHelper}
            />
          } />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable[0].querySelectorAll('.tbody .tr [role="cell"]');
  const sortableHrefWrapper = sortableTableWrapper[1].querySelectorAll('a[href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name"]');
  t.is(sortableHrefWrapper.length, 1);
});

test.serial('Checking granule for size prop', function (t) {
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/granules/my-granule-id']}>
        <Routes>
          <Route path="/granules/:granuleId" element={
            <GranuleOverview
              dispatch={dispatch}
              executions={executions}
              granules={granules}
              logs={logs}
              recoveryStatus={recoveryStatus}
              skipReloadOnMount={true}
              workflowOptions={[]}
              urlHelper={urlHelper}
            />
          } />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
  
  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable[0].querySelectorAll('.tbody .tr .td[role="cell"]');
  const sortableCellWrapper = sortableTableWrapper[2].textContent;
  t.is(sortableCellWrapper, '10239');
});