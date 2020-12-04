'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { ExecutionStatus } from '../../../app/src/js/components/Executions/execution-status';
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

  const metadata = executionStatusRendered.find('Metadata');
  t.is(metadata.length, 1);

  const metadataWrapper = metadata.dive();
  const metadataDetails = metadataWrapper.find('dl');
  t.is(metadataDetails.length, 1);

  const metadataLabels = metadataDetails.find('dt');
  t.is(metadataLabels.length, 9);
  const metadataValues = metadataDetails.find('dd');
  t.is(metadataValues.length, 9);
});
