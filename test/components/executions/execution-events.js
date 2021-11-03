'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';
import * as redux from 'react-redux';
import sinon from 'sinon';

import { ExecutionEvents } from '../../../app/src/js/components/Executions/execution-events';
import executionHistory from '../../../test/fixtures/execution-history-all';

configure({ adapter: new Adapter() });

const match = {
  params: { executionArn: executionHistory.execution.executionArn },
};

const dispatch = () => {};

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, "useDispatch").returns(sinon.spy());
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
    execution: executionHistory.execution,
    executionHistory: plainEventsExecutionHistory,
    stateMachine: executionHistory.execution,
    inflight: true,
    error: false,
    meta: {},
  };

  const executionEvents = shallow(
    <ExecutionEvents
      dispatch={dispatch}
      location={{}}
      match={match}
      executionStatus={executionStatus}
    />
  );

  const sortableTable = executionEvents.find('SortableTable');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable.dive();
  const tableRows = sortableTableWrapper.find('.tbody .tr');
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

  tableRows.forEach((row, index) => {
    const columns = row.find('Cell');
    t.is(columns.length, 3);
    const stepName = columns.at(1).shallow().text();
    t.assert(stepName.includes(expectedStepNames[index]));
  });
});

test.serial('Execution Events shows event history', function (t) {
  const executionStatus = {
    execution: executionHistory.execution,
    executionHistory: executionHistory.executionHistory,
    stateMachine: executionHistory.execution,
    inflight: true,
    error: false,
    meta: {},
  };

  const executionEvents = shallow(
    <ExecutionEvents
      dispatch={dispatch}
      location={{}}
      match={match}
      executionStatus={executionStatus}
    />
  );
  const sortableTable = executionEvents.find('SortableTable');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable.dive();
  const tableRows = sortableTableWrapper.find('.tbody .tr');
  t.is(tableRows.length, 19);

  const expectedWorkflowTasksData = {
    StatusReport: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
    },
    DiscoverGranules: {
      version: '$LATEST',
      name: 'test-DiscoverGranules',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-DiscoverGranules',
    },
    StopStatus: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport',
    },
  };

  tableRows.forEach((row) => {
    const columns = row.find('Cell');
    t.is(columns.length, 3);
    const moreDetails = columns.last().shallow().find('pre');
    moreDetails.map((node) => {
      const parsedDetailsOutput = JSON.parse(node.text()).output;
      if (
        parsedDetailsOutput &&
        parsedDetailsOutput.meta &&
        parsedDetailsOutput.meta.workflow_tasks &&
        Object.keys(parsedDetailsOutput.meta.workflow_tasks).length === 3
      ) {
        t.deepEqual(
          parsedDetailsOutput.meta.workflow_tasks,
          expectedWorkflowTasksData
        );
      }
    });
  });
});