'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { configure, shallow } from 'enzyme';
import {
  getProvider,
  updateProvider,
  clearUpdateProvider
} from '../../../app/src/js/actions';
import { EditRecord } from '../../../app/src/js/components/Edit/edit.js';

configure({ adapter: new Adapter() });

test('EditRecord sends full object when merge property is true', (t) => {
  const monkeyInTheMiddle = () =>
    // Simply unwrap the simple action from the complex action and pass it
    // along to the reducer.  We get `action` as { "undefined": simpleAction },
    // so we're extracting the single value (simpleAction) for the reducer.
    (next) => (action) => next(Object.values(action)[0]);
  const mockStore = configureMockStore([monkeyInTheMiddle]);
  const provider = { id: 123, foo: 'bar' };
  const providersState = { map: { [provider.id]: { data: provider } } };
  const schemaKey = 'provider';
  const schema = { [schemaKey]: {} };
  const store = mockStore({});

  const providerWrapper = shallow(
    <Provider store={store}>
      <EditRecord
        schemaState={schema}
        dispatch={store.dispatch}
        merge={true}
        pk={`${provider.id}`}
        schemaKey={schemaKey}
        state={providersState}
        getRecord={getProvider}
        updateRecord={updateProvider}
        clearRecordUpdate={clearUpdateProvider}
        backRoute={`providers/provider/${provider.id}`}
      />
    </Provider>
  );

  const editRecordWrapper = providerWrapper.find(EditRecord).dive();
  const schemaWrapper = editRecordWrapper.find('Schema').dive();
  const formWrapper = schemaWrapper.find('Form').dive();
  const submitButton = formWrapper.find('.button--submit');

  store.clearActions();
  submitButton.simulate('click');

  t.is(store.getActions().length, 1);
  t.deepEqual(store.getActions()[0].data, provider);
});
