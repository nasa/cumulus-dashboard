'use strict';

import test from 'ava';
import React from 'react';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

import GranuleOverview from '../../../app/src/js/components/Granules/granule.js';

const logs = { items: [''] };

const granules = {
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
            bucket: 'my-bucket',
            size:  10239
          }
        ]
      }
    }
  }
};
const locationQueryParams = {search: {} }
const executions = {
  map: {
    'my-granule-id': {
      data: [],
      error: null,
    }
  }
};
const recoveryStatus = { map: {} };
const workflowOptions = [];

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

const someStore = mockStore({
  getState: () => {},
  subscribe: () => {},
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams: locationQueryParams,
  granules: granules,
  executions: executions,
  logs: logs,
  recoveryStatus: recoveryStatus,
  workflowOptions: workflowOptions
});

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, "useDispatch").returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('CUMULUS-336 Granule file links use the correct URL', function (t) {

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter initialEntries={['/granules/granule/my-granule-id']}>
    <GranuleOverview
      skipReloadOnMount={true}
    />
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
    <MemoryRouter initialEntries={['/granules/granule/my-granule-id']}>
    <GranuleOverview
      skipReloadOnMount={true}
    />
    </MemoryRouter>
    </Provider>
  );
  
  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable[0].querySelectorAll('.tbody .tr .td[role="cell"]');
  const sortableCellWrapper = sortableTableWrapper[2].textContent;
  t.is(sortableCellWrapper, '10239');
});