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
import metadata from '../../../app/src/js/components/Table/Metadata.js';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter} from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Metadata from '../../../app/src/js/components/Table/Metadata.js';
import { name } from 'file-loader';

//configure({ adapter: new Adapter() });

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
        executionStatus={executionStatus}
        executionHistory={executionHistory}
        metadata={metadata}
      />
      </MemoryRouter>
      </Provider>
    );


  const metadata = container.querySelectorAll('metadata');
  t.is(metadata.length, 1);

  //const metadataWrapper = metadata.find();
  //expect(screen.getByText('metadata')).toBeInTheDocument();
  const metadataWrapper = container.querySelectorAll('Metadata');
 
  //const metadataDetails = metadataWrapper.querySelectorAll('dl');
 
  
  const metadataDetails = JSON.stringify(screen).at('dl');
  t.is(metadataDetails.length, 1);



  //const metadataDetails = within(executionStatus).querySelectorAll('dl');
  //t.is(metadataDetails.length, 1);

  screen.debug();
  console.log("============== testData", JSON.stringify(metadataDetails));

 
  //const metadataLabels = container.querySelectorAll('.metadata .dt');
  const metadataLabels = JSON.stringify(executionStatus).at('dt');
  t.is(metadataLabels.length, 9);

  screen.debug();
  console.log("============== testData", container);
    

  const metadataValues = metadataDetails.find('dd');
  t.is(metadataValues.length, 9);

  const granulesTable = executionStatusRendered.find('withRouter(withQueryParams(Connect(List)))');
  t.is(granulesTable.length, 1);

});
