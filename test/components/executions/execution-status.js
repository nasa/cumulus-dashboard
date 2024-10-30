'use strict';

import test from 'ava';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';

import { ExecutionStatus } from '../../../app/src/js/components/Executions/execution-status';
import executionHistory from '../../../test/fixtures/execution-history-all';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

// configure({ adapter: new Adapter() });

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

  const match = { params: { executionArn: executionHistory.execution.executionArn } };

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

  const { executionStatusRendered } = render(
    <Provider store={someStore}>
      <MemoryRouter>
        <ExecutionStatus
          dispatch={dispatch}
          match={match}
          logs={{}}
          executionStatus={executionStatus}
          skipReloadOnMount={true}
          />
      </MemoryRouter>
    </Provider>
  );

  screen.debug();

  const metadata = executionStatusRendered.querySelector('Metadata');
  t.is(metadata.length, 1);

  const metadataWrapper = metadata.dive();
  const metadataDetails = metadataWrapper.querySelector('dl');
  t.is(metadataDetails.length, 1);

  const metadataLabels = metadataDetails.querySelector('dt');
  t.is(metadataLabels.length, 9);
  const metadataValues = metadataDetails.querySelector('dd');
  t.is(metadataValues.length, 9);

  const granulesTable = executionStatusRendered.querySelector('withRouter(withQueryParams(Connect(List)))');
  t.is(granulesTable.length, 1);
});
