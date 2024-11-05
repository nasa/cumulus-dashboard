'use strict';

import test from 'ava';
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react';
import { BulkGranule } from '../../../app/src/js/components/Granules/bulk.js';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

const granules = {};
const dispatch = () => { };
const locationQueryParams = {
  search: {}
};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);

test('BulkGranule does not generate button for bulk recovery when recovery is not enabled', function (t) {
  const configWithRecovery = { enableRecovery: false };

  const someStore = mockStore({
    getState: () => {},
    subscribe: () => {},
    dispatch,
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    locationQueryParams,
    granulesExecutions : {
      workflows: {
        data: ['fakeworkflow1', 'fakeworkflow2']
      }
    },
    config: configWithRecovery
  });

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <BulkGranule
      dispatch={dispatch}
      config={configWithRecovery}
      confirmAction={true}
      element='button'
      className='button button__bulkgranules'
      granules={granules}
    />
    </MemoryRouter>
    </Provider>);
  fireEvent.click(container.querySelector('.button'));
  t.throws(() => screen.getByText('Run Bulk Recovery'));
});

test('BulkGranule generates button for bulk recovery when recovery is enabled', function (t) {
  const configWithRecovery = { enableRecovery: true };

  const someStore = mockStore({
    getState: () => {},
    subscribe: () => {},
    dispatch,
    timer: { running: false, seconds: -1 },
    datepicker: initialState(),
    locationQueryParams,
    granulesExecutions : {
      workflows: {
        data: ['fakeworkflow1', 'fakeworkflow2']
      }
    },
    config: configWithRecovery
  });

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <BulkGranule
      dispatch={dispatch}
      config={configWithRecovery}
      confirmAction={true}
      element='button'
      className='button button__bulkgranules'
      granules={granules}
    />
    </MemoryRouter>
    </Provider>);

  fireEvent.click(container.querySelector('.button'));
  t.truthy(screen.getByText('Run Bulk Recovery'));
});
