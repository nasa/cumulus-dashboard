'use strict';

import test from 'ava';
import React from 'react';
import SimpleDropDown from '../../../app/src/js/components/DropDown/simple-dropdown';
import { executeDialog } from '../../../app/src/js/utils/table-config/granules';
import { render, screen } from '@testing-library/react';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';

const locationQueryParams = {
  search: {}
};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams,
  defaultQuery: {query: ''},
  getState: () => {},
  dispatch: () => {},
  subscribe: () => {},
  value: 'workflow',
});

test('CUMULUS-2108 executeDialog renders expected components', function (t) { 
  const { container } = render(
    <Provider store={someStore}>
      {executeDialog({
        selectHandler: () => {},
        label: 'workflow-dropdown',
        value: 'workflow',
        options: [],
        initialMeta: {},
        metaHandler: () => {},
      })}
    </Provider>
  )

  t.is(container.querySelectorAll('.form__dropdown').length, 1);
  t.is(container.querySelectorAll('textarea').length, 1);
});
