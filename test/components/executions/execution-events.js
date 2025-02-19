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

const match = {
  params: { executionArn: executionHistory.execution.executionArn },
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
        executionHistory={executionHistory}
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

test.serial('Execution Events shows event history', function (t) {
  const executionStatus = {
    data: {
      presignedS3Url: 'http://example.com/presignedS3Url',
      data: {
        execution: executionHistory.execution,
        executionHistory: executionHistory.executionHistory,
        stateMachine: executionHistory.execution,
      }
    },
    inflight: true,
    error: false,
    meta: {},
  };
  let testedExpectedAssertion = false;

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter>
      <ExecutionEvents
        dispatch={dispatch}
        location={{}}
        match={match}
        executionStatus={executionStatus}    
        executionHistory={executionHistory}    
      />
      </MemoryRouter>
      </Provider>
    );

    const sortableTable = container.querySelectorAll('.table--wrapper');
    t.is(sortableTable.length, 1);
  
    const sortableTableRows = container.querySelectorAll('.tbody .tr');
    t.is(sortableTableRows.length, 19);

  const expectedWorkflowTasksData = {
    0: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
    },
    1: {
      version: '$LATEST',
      name: 'test-DiscoverGranules',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-DiscoverGranules',
    },
    2: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
    },
  };

  const moreDetails = JSON.stringify(executionHistory);
  if (moreDetails.includes(
    expectedWorkflowTasksData[0].arn, expectedWorkflowTasksData[0].name, expectedWorkflowTasksData[0].version,
    expectedWorkflowTasksData[1].arn, expectedWorkflowTasksData[1].name, expectedWorkflowTasksData[1].version,
    expectedWorkflowTasksData[2].arn, expectedWorkflowTasksData[2].name, expectedWorkflowTasksData[2].version))
    {testedExpectedAssertion = true;}
   else 
    {testedExpectedAssertion = false;}

});