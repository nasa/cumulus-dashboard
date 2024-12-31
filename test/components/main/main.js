'use strict';

import test from 'ava';
import { Provider } from 'react-redux';
import { render} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import React from 'react';
import thunk from 'redux-thunk';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import { Main } from '../../../app/src/js/main';

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const dispatch = () => {};
const initialState = {
  api: { authenticated: true },
  locationQueryParams: { search: {} },
  apiVersion : {
    versionNumber: '1.11.0',
    warning: '',
    isCompatible: true
  },
  cmrInfo: {
    cmrEnv: 'UAT',
    cmrProvider: 'CUMULUS',
    cmrOauthProvider: 'Launchpad'
  }
};

test('Main wrapper shows `Local (Development)` at top by default', function (t) {
  const someStore = mockStore(initialState);
  const { container } = render(
    <Provider store={someStore} >
      <MemoryRouter>
        <Main 
        dispatch={dispatch}
        api={initialState.api}
        apiVersion={initialState.apiVersion}
        cmrInfo={initialState.cmrInfo}
         />
      </MemoryRouter>
    </Provider>
  );

  const appTarget = container.querySelectorAll('.app__target');
  t.is(appTarget.length, 1);
  t.is(appTarget[0].textContent, 'Local (Development)');
});
