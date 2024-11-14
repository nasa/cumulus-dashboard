////*************************************************************************************************************************************
////Updated by: Rich Frausto, Bryan Wexler
////Date Modified: November 11, 2024
////Project: CUMULUS-3861: Dashboard: Replace Enzyme with React Testing Library(RTL)
////Reason:  Broke out the two tests that were in the execution-events.js file into two individual test script files. 
////         Removed references to Enzyme and replaced them with React compliant testing components. 
////         Brought in the ExecutionHistory test fixture and refactored the last test assert to use JSON Stringify instead of Parse. 
////Number of Test Cases: 1
////Number of Test Assertions: 4
////Test Reviewer: Bryan Wexler November 14, 2024
////*************************************************************************************************************************************

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

//Command to execute the test: npx ava test/components/executions/execution-events_showEventHistory.js
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

  const tableRows = screen.getAllByRole('row');
  tableRows.slice(1).forEach((row) => {
  const columns = within(row).getAllByRole('cell');
  t.is(columns.length, 3);

  const moreDetails = JSON.stringify(executionHistory);
  if (moreDetails.includes(
    expectedWorkflowTasksData[0].arn, expectedWorkflowTasksData[0].name, expectedWorkflowTasksData[0].version,
    expectedWorkflowTasksData[1].arn, expectedWorkflowTasksData[1].name, expectedWorkflowTasksData[1].version,
    expectedWorkflowTasksData[2].arn, expectedWorkflowTasksData[2].name, expectedWorkflowTasksData[2].version))
    {testedExpectedAssertion = true;}
   else 
    {testedExpectedAssertion = false;}
  });

  t.true(testedExpectedAssertion);
});