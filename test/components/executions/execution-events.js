'use strict';

import test from 'ava';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';
import * as redux from 'react-redux';
import sinon from 'sinon';

import { ExecutionEvents } from '../../../app/src/js/components/Executions/execution-events';
import executionHistory from '../../../test/fixtures/execution-history-all';

import { render, screen } from '@testing-library/react';
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

  screen.debug();
  // console.log("=========== container", container.innerHTML);

  // const sortableTable = container.querySelector('.SortableTable');
  // t.is(sortableTable.length, 1);

  // screen.debug();
  // console.log("========== sortable table", sortableTable);

  // const sortableTableWrapper = sortableTable[0].querySelectorAll('.tbody .tr');
  
  // screen.debug();
  // console.log("============== sortableTable", sortableTable.innerHTML);

  // t.is(sortableTableWrapper.length, 9);
  // const expectedStepNames = [
  //   'N/A',
  //   'SyncGranule',
  //   'SyncGranule',
  //   'SyncGranule',
  //   'SyncGranule',
  //   'SyncGranule',
  //   'ChooseProcess',
  //   'ChooseProcess',
  //   'N/A',
  // ];

  // screen.debug()
  // console.log("============== sortableTableWrapper ", sortableTableWrapper[0].textContent);

  // const tableRows = sortableTableWrapper.querySelector('.tbody .tr');

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


  // tableRows.forEach((row, index) => {
  //   const columns = row.find('Cell');
  //   t.is(columns.length, 3);
  //   const stepName = columns.at(1).shallow().text();
  //   t.assert(stepName.includes(expectedStepNames[index]));
  // });
});

// test.serial('Execution Events shows event history', function (t) {
//   const executionStatus = {
//     data: {
//       presignedS3Url: 'http://example.com/presignedS3Url',
//       data: {
//         execution: executionHistory.execution,
//         executionHistory: executionHistory.executionHistory,
//         stateMachine: executionHistory.execution,
//       }
//     },
//     inflight: true,
//     error: false,
//     meta: {},
//   };
//   let testedExpectedAssertion = false;

//   const executionEvents = shallow(
//     <ExecutionEvents
//       dispatch={dispatch}
//       location={{}}
//       match={match}
//       executionStatus={executionStatus}
//     />
//   );
//   const sortableTable = executionEvents.find('SortableTable');
//   t.is(sortableTable.length, 1);

//   const sortableTableWrapper = sortableTable.dive();
//   const tableRows = sortableTableWrapper.find('.tbody .tr');
//   t.is(tableRows.length, 19);

//   const expectedWorkflowTasksData = {
//     0: {
//       version: '$LATEST',
//       name: 'test-SfSnsReport',
//       arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
//     },
//     1: {
//       version: '$LATEST',
//       name: 'test-DiscoverGranules',
//       arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-DiscoverGranules',
//     },
//     2: {
//       version: '$LATEST',
//       name: 'test-SfSnsReport',
//       arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
//     },
//   };

//   tableRows.forEach((row) => {
//     const columns = row.find('Cell');
//     t.is(columns.length, 3);
//     const moreDetails = JSON.parse(
//       columns.at(1).dive().find('pre').render().html()
//     );
//     if (
//       moreDetails.output &&
//       moreDetails.output.meta &&
//       moreDetails.output.meta.workflow_tasks &&
//       Object.keys(moreDetails.output.meta.workflow_tasks).length === 3
//     ) {
//       testedExpectedAssertion = true;
//       t.deepEqual(
//         moreDetails.output.meta.workflow_tasks,
//         expectedWorkflowTasksData
//       );
//     }
//   });

//   t.true(testedExpectedAssertion);
// });
