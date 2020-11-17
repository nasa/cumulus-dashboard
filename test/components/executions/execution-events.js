'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { ExecutionEvents } from '../../../app/src/js/components/Executions/execution-events';
import executionHistory from '../../../test/fixtures/execution-history-all';

configure({ adapter: new Adapter() });

test('Execution Events shows event history', function (t) {
  const executionStatus = {
    execution: executionHistory.execution,
    executionHistory: executionHistory.executionHistory,
    stateMachine: executionHistory.execution,
    inflight: true,
    error: false,
    meta: {}
  };

  const match = { params: { executionArn: executionHistory.execution.executionArn } };

  const dispatch = () => {};

  const executionEventsRendered = shallow(
    <ExecutionEvents
      dispatch={dispatch}
      location={{}}
      match={match}
      executionStatus={executionStatus}
    />
  );

  const sortableTable = executionEventsRendered.find('SortableTable');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable.dive();
  const tableRows = sortableTableWrapper.find('div.tr[data-value]');
  t.is(tableRows.length, 19);

  const expectedWorkflowTasksData = {
    StatusReport: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport'
    },
    DiscoverGranules: {
      version: '$LATEST',
      name: 'test-DiscoverGranules',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-DiscoverGranules'
    },
    StopStatus: {
      version: '$LATEST',
      name: 'test-SfSnsReport',
      arn: 'arn:aws:lambda:us-east-1:000000000000:function:test-SfSnsReport'
    }
  };

  tableRows.forEach(row => {
    const columns = row.find('Cell');
    t.is(columns.length, 4);
    const moreDetails = columns.last().shallow().find('pre');
    moreDetails.map(node => {
      const parsedDetailsOutput = JSON.parse(node.text()).output;
      if (parsedDetailsOutput && parsedDetailsOutput.meta &&
        parsedDetailsOutput.meta.workflow_tasks &&
        Object.keys(parsedDetailsOutput.meta.workflow_tasks).length === 3) {
        t.deepEqual(parsedDetailsOutput.meta.workflow_tasks, expectedWorkflowTasksData);
      }
    });
  });
});
