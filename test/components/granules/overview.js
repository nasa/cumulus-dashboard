'use strict';

import test from 'ava';
import { get } from 'object-path';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, configure } from 'enzyme';
import { GranulesOverview } from '../../../app/src/js/components/Granules/overview';

configure({ adapter: new Adapter() });

const granules = {
  list: {
    meta: {
      count: 12,
      queriedAt: 0
    }
  },
  map: {
    'my-granule-id': {
      data: {
        name: 'my-name',
        filename: 'my-filename',
        bucket: 'my-bucket',
        status: 'success',
        files: [
          {
            fileName: 'my-name',
            key: 'my-key-path/my-name',
            bucket: 'my-bucket'
          }
        ]
      }
    }
  }
};

const dispatch = () => {};
const workflowOptions = [];
const collections = {};
const providers = {};
const stats = { count: 0, stats: {} };
const location = { pathname: 'granules' };
const config = { enableRecovery: false };
const store = {
  subscribe: () => {},
  dispatch: dispatch,
  getState: () => {}
};

test('GranulesOverview generates bulkAction for recovery button', function (t) {
  const configWithRecovery = { enableRecovery: true };
  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        stats = {stats}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        collections = {collections}
        location = {location}
        config={configWithRecovery}
        providers={providers}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('withRouter(withQueryParams(Connect(List)))');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});

test('GranulesOverview does not generate bulkAction for recovery button', function (t) {
  const config = { enableRecovery: false };
  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        stats = {stats}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        collections = {collections}
        location = {location}
        config={config}
        providers={providers}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('withRouter(withQueryParams(Connect(List)))');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});

test('GranulesOverview generates Granule Inventory List button', function (t) {
  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        dispatch = {dispatch}
        location = {location}
        workflowOptions = {workflowOptions}
        collections = {collections}
        config={config}
        providers={providers}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();

  const listWrapper = overviewWrapper.find('withRouter(withQueryParams(Connect(List)))');
  const listBulkActions = listWrapper.prop('bulkActions');
  const filter = (object) => get(object, 'Component.props.className', '').includes('csv__download');
  const granuleInventoryActionList = listBulkActions.filter(filter);
  t.is(granuleInventoryActionList.length, 1);
});
