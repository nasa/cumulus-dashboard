'use strict';

import test from 'ava';
import React from 'react';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { ExecutionEvents } from '../../../app/src/js/components/Executions/execution-events.js';
import executionHistory from '../../fixtures/execution-history-all.js';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker.js';
import { Provider } from 'react-redux';

const locationQueryParams = {
  search: {}
};
const dispatch = () => {};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  getState: () => {},
  subscribe: () => {},
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams,
  dispatch
});

const match = {
  params: { executionArn: executionHistory.execution.executionArn },
};

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, 'useDispatch').returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('Execution Events displays the correct step name', function (t) {
  const plainEventsExecutionHistory = {
    events: [
      {
        id: 0,
        type: 'ExecutionStarted',
      },
      {
        id: 1,
        type: 'TaskStateEntered',
        name: 'SyncGranule',
      },
      {
        id: 2,
        type: 'LambdaFunctionScheduled',
      },
      {
        id: 3,
        type: 'LambdaFunctionStarted',
      },
      {
        id: 4,
        type: 'LambdaFunctionSucceeded',
      },
      {
        id: 5,
        type: 'TaskStateExited',
        name: 'SyncGranule',
      },
      {
        id: 6,
        type: 'ChoiceStateEntered',
        name: 'ChooseProcess',
      },
      {
        id: 7,
        type: 'ChoiceStateExited',
        name: 'ChooseProcess',
      },
      {
        id: 8,
        type: 'ExecutionSucceeded',
      },
    ],
  };

  const executionStatus = {
    data: {
      presignedS3Url: 'http://example.com/presignedS3Url',
      data: {
        execution: executionHistory.execution,
        executionHistory: plainEventsExecutionHistory,
        stateMachine: executionHistory.execution,
      }
    },
    inflight: true,
    error: false,
    meta: {},
  };

  const { container } = render(
  <Provider store={someStore}>
    <MemoryRouter>
    <ExecutionEvents
      dispatch={dispatch}
      location={{}}
      match={match}
      executionStatus={executionStatus}
    />
    </MemoryRouter>
    </Provider>
  );

  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableRows = screen.getByRole('table');
  const tableRows = sortableTableRows.querySelectorAll('.tbody .tr');
  t.is(tableRows.length, 9);

  const expectedStepNames = [
     'N/A',
     'SyncGranule',
     'SyncGranule',
     'SyncGranule',
     'SyncGranule',
     'SyncGranule',
     'ChooseProcess',
     'ChooseProcess',
     'N/A',
   ];

   const rows = screen.getAllByRole('row');
   rows.slice(1).forEach((row, index) => {
   const cells = within(row).getAllByRole('cell');
   t.is(cells.length, 3);

   const stepName = cells[1].textContent;
   t.assert(stepName.includes(expectedStepNames[index]));

  });   
});