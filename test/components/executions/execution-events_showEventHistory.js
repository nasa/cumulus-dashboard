'use strict';

import test from 'ava';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';
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

// console.log("============= dispatch ", dispatch);

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, 'useDispatch').returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
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
      />
      </MemoryRouter>
      </Provider>
    );

  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableRows = container.querySelectorAll('.tbody .tr');
  t.is(sortableTableRows.length, 19);

  //screen.debug()
  //console.log("============== Test2_sortableTableWrapper ", sortableTableRows[0].textContent);

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

  //console.log("============== Test2_data", sortableTable);
  //screen.debug()
 //console.log("============== Test2_data", columns.slice(1));
  
  //const preElement = columns[1].querySelector('pre');
  //const moreDetails = JSON.parse(preElement.textContent);
  columns.slice(1).forEach((row) => {
    const cells = row.querySelectorAll('td');
    const moreDetails = JSON.parse(cells[1].querySelector('pre')?.textContent || '{}');
    if (
      moreDetails.output &&
      moreDetails.output.meta &&
      moreDetails.output.meta.workflow_tasks &&
      Object.keys(moreDetails.output.meta.workflow_tasks).length === 3
    ) {
      testedExpectedAssertion = true;
      t.deepEqual(
        moreDetails.output.meta.workflow_tasks,
        expectedWorkflowTasksData
      );
    }
  });

  t.true(testedExpectedAssertion);
});
});