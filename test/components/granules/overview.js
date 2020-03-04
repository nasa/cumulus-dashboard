'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'jsdom-global/register';
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
const data = '';

test('GranulesOverview generates bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const workflowOptions = [];
  const stats = { count: 0, stats: {} };
  const location = { pathname: 'granules' };
  const config = { enableRecovery: true };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        granuleCSV = {data}
        stats = {stats}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        location = {location}
        config={config}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('Connect(List)');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});

test('GranulesOverview does not generate bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const workflowOptions = [];
  const stats = { count: 0, stats: {} };
  const location = { pathname: 'granules' };
  const config = { enableRecovery: false };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        stats = {stats}
        granuleCSV = {data}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        location = {location}
        config={config}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('Connect(List)');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});
