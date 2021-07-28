'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { Provider } from 'react-redux';

import { GranuleOverview } from '../../../app/src/js/components/Granules/granule.js';

configure({ adapter: new Adapter() });

const logs = { items: [] };

const match = { params: { granuleId: 'my-granule-id' } };
const store = {
    getState: () => {},
    dispatch,
    subscribe: () => {}
};
const dispatch = () => {};
const granules = {
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
            bucket: 'my-bucket',
            size:  10239
          }
        ]
      }
    }
  }
};

test('CUMULUS-336 Granule file links use the correct URL', function (t) {

  const granuleOverview = shallow(
    <Provider store = {store}>
    <GranuleOverview
      dispatch={dispatch}
      match={match}
      granules={granules}
      logs={logs}
      skipReloadOnMount={true}
      workflowOptions={[]}
    /></Provider>);

  const sortableTable = granuleOverview.find('GranuleOverview');
  t.is(sortableTable.length, 1);
  const sortableTableWrapper = sortableTable.dive();
  t.is(sortableTableWrapper
    .find('.tbody .tr')
    .find('Cell').at(1).dive()
    .find('a[href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name"]').length, 1);
});
test('Checking granule for size prop', function (t) {
  const granuleOverview = shallow(
    <Provider store = {store}>
    <GranuleOverview
      dispatch={dispatch}
      match={match}
      granules={granules}
      logs={logs}
      skipReloadOnMount={true}
      workflowOptions={[]}
    /></Provider>);

  const sortableTable = granuleOverview.find('GranuleOverview');
  const reducedTable = sortableTable.find('SortableTable');
  if(reducedTable){
    console.log(sortableTable);
  }
  t.is(reducedTable.length, 1);
  const sortableTableWrapper = reducedTable.dive();
  t.is(sortableTableWrapper
    .find('.tbody .tr .td')
    .find('Cell').at(2).dive()
    .text(), '10239');
});

