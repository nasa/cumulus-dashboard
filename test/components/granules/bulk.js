'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
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
  }
});

test('BulkGranule does not generate button for bulk recovery when recovery is not enabled', function (t) {
  const configWithRecovery = { enableRecovery: false };
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

  console.log(container.innerHTML);
  screen.debug();
  console.log("\n");
  const buttons = container.querySelectorAll('.button');
  const recoverFilter = (object) => object.textContext === 'Run Bulk Recovery';
  const recoveryButtonsProps = Array.from(buttons).filter(recoverFilter);
  t.is(recoveryButtonsProps.length, 0);
});

test('BulkGranule generates button for bulk recovery when recovery is enabled', function (t) {
  const configWithRecovery = { enableRecovery: true };
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

  console.log(container.innerHTML);
  screen.debug();
  const buttons = container.querySelectorAll('.button');
  const recoverFilter = (object) => object.textContext === 'Run Bulk Recovery';
  const recoveryButtonsProps = Array.from(buttons).filter(recoverFilter);
  t.is(recoveryButtonsProps.length, 1); // not working properly, other button just appears as: Run Bulk Granules, not: Run Bulk Recovery
});
