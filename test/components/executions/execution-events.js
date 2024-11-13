'use strict';

import test from 'ava';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';
import * as redux from 'react-redux';
import sinon from 'sinon';

import { ExecutionEvents } from '../../../app/src/js/components/Executions/execution-events';
import executionHistory from '../../../test/fixtures/execution-history-all';

import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

import { BulkGranuleModal } from '../../../app/src/js/components/Granules/bulk-granule-modal.js';

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

  //screen.debug();
  //console.log("=========== container", container.innerHTML);

  const sortableTable = container.querySelectorAll('.table--wrapper');
  t.is(sortableTable.length, 1);

  const sortableTableRows = screen.getByRole('table');
  const tableRows = sortableTableRows.querySelectorAll('.tbody .tr');
  t.is(tableRows.length, 9);
 
  //screen.debug();
  //console.log("============== sortableTableRows", sortableTableRows.innerHTML);

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

   //screen.debug()
   //console.log("============== sortableTableWrapper ", sortableTableRows[0].textContent);

  //const tableRows = sortableTableWrapper.querySelectorAll('.tbody .tr');

  // console.log(sortableTableWrapper.innerHTML);

  // =============================================
  // const rows = screen.getAllByRole('row');
  // rows.slice(1).forEach(row, index) => {
  //   const cells = within(row).getAllByRole('cell');
  //   expect(cells[0]).toHaveTextContent(index + 1).toString());
  //   expect(cells[1]).toHaveTextContent(/<content>/) // need to find out expected content
  //   expect(cells[2]).toHaveTextContent(/<content>/) // need to find out expected content
  // };  
  // =============================================  


  //  tableRows.forEach((row, index) => {
  //    const columns = row.find('Cell');
  //    t.is(columns.length, 3);
  //    const stepName = columns.at(1).shallow().text();
  //    t.assert(stepName.includes(expectedStepNames[index]));
  //  });
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