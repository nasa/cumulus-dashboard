'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { ExecutionStatus } from '../../../app/src/js/components/Executions/execution-status.js';
import executionHistory from '../../../test/fixtures/execution-history-all';

configure({ adapter: new Adapter() });

test('Cumulus-690 Execution Status shows workflow task and version information', function (t) {
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

  const executionStatusRendered = shallow(
    <ExecutionStatus
      dispatch={dispatch}
      match={match}
      executionStatus={executionStatus}
      skipReloadOnMount={true}
    />
  );

  const sortableTable = executionStatusRendered.find('SortableTable');
  t.is(sortableTable.length, 1);

  const sortableTableWrapper = sortableTable.dive();
  const moreDetails = sortableTableWrapper.find('Cell').first().find('pre');
  const selectedTasks = moreDetails.findWhere((jsonDetails) => {
    const parsedDetailsOutput = JSON.parse(jsonDetails.text()).output;
    if (parsedDetailsOutput && parsedDetailsOutput.meta && parsedDetailsOutput.meta.workflow_tasks) {
      return Object.keys(parsedDetailsOutput.meta.workflow_tasks).length === 3;
    } else {
      return false;
    }
  });

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

  selectedTasks.forEach((s) => {
    t.deepEqual(JSON.parse(s.text()).output.meta.workflow_tasks, expectedWorkflowTasksData);
  });
});
