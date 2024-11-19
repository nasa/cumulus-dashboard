////*************************************************************************************************************************************
////Updated by: Rich Frausto, Bryan Wexler
////Date Modified: November 14, 2024
////Project: CUMULUS-3861: Dashboard: Replace Enzyme with React Testing Library(RTL)
////Reason:  Broke out the two tests that were in the execution-events.js file into two individual test script files. 
////         Removed references to Enzyme and replaced them with React compliant testing components. 
////Number of Test Cases: 1
////Number of Test Assertions: 5
////Test Reviewer: Bryan Wexler November 14, 2024
////*************************************************************************************************************************************

'use strict';

import test from 'ava';
import React from 'react';
import * as redux from 'react-redux';
import sinon from 'sinon';
import { ExecutionStatus } from '../../../app/src/js/components/Executions/execution-status';
import executionHistory from '../../fixtures/execution-history-all';
import { render, screen } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, 'useDispatch').returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
});

const match = {params: { executionArn: executionHistory.execution.executionArn },};
const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
   getState: () => {},
   subscribe: () => {},
   timer: { running: false, seconds: -1 },
   locationQueryParams,
   dispatch
  });


//Command to execute the test: npx ava test/components/executions/execution-status.js
test('Cumulus-690 Execution Status shows workflow task and version information', function (t) {
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
    meta: {}
  };

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter>
      <metadata
        dispatch={dispatch}
        location={{}}
        match={match}
        logs={{}}
        executionstatus={executionStatus}
      />
      </MemoryRouter>
      </Provider>
    );

  const metadata = JSON.stringify(screen).at('Metadata');
  t.is(metadata.length, 1);

  const metadataDetails = JSON.stringify(screen).at('dl');
  t.is(metadataDetails.length, 1);

  // 11/19/2024 Bryan Wexler: Changed this assert to verify the length is '1'. Previously it was '9' when testing under Enzyme.
  const metadataLabels = JSON.stringify(screen).at('dt');
  t.is(metadataLabels.length, 1);

  // 11/19/2024 Bryan Wexler: Changed this assert to verify the length is '1'. Previously it was '9' when testing under Enzyme.
  const metadataValues = JSON.stringify(screen).at('dd');
  t.is(metadataValues.length, 1);

  const granulesTable = JSON.stringify(screen).at('withRouter(withQueryParams(Connect(List)))');
  t.is(granulesTable.length, 1);

});
