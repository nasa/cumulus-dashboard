'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { Provider } from 'react-redux';
import { CollectionList } from '../../../app/src/js/components/Collections/list';

configure({ adapter: new Adapter() });

const collections = {
  created: {},
  deleted: {},
  list: {
    data: [
      { name: 'https_testcollection', version: '001', createdAt: 0 }
    ],
    meta: {
      count: 0,
      queriedAt: 0
    }
  },
  map: {},
  updated: {}
};

const providers = {
  providers: {
    list: {
      data: [],
      meta: {},
      params: {}
    },
    dropdowns: {
      provider: {
        options: [
          {
            id: 's3_provider',
            label: 's3_provider'
          },
          {
            id: 'http_provider',
            label: 'http_provider'
          }
        ],
      }
    }
  }
};

test('Collections Overview generates bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const logs = {};
  const config = { enableRecovery: true };
  const store = {
    getState: () => {},
    dispatch,
    subscribe: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <CollectionList
        collections = {collections}
        dispatch = {dispatch}
        logs = {logs}
        config = {config}
        providers = {providers}/>
    </Provider>);

  const collectionsWrapper = providerWrapper.find('CollectionList').dive();
  const listWrapper = collectionsWrapper.find('withRouter(withQueryParams(Connect(List)))');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});

test('Collections Overview does not generate bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const logs = {};
  const config = { enableRecovery: false };
  const store = {
    getState: () => {},
    dispatch,
    subscribe: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <CollectionList
        collections = {collections}
        dispatch = {dispatch}
        logs = {logs}
        config = {config}
        providers = {providers}/>
    </Provider>);

  const collectionsWrapper = providerWrapper.find('CollectionList').dive();
  const listWrapper = collectionsWrapper.find('withRouter(withQueryParams(Connect(List)))');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});
