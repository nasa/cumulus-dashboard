'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import * as redux from 'react-redux';
import sinon from 'sinon';

import { GranuleOverview } from '../../../app/src/js/components/Granules/granule.js';

configure({ adapter: new Adapter() });

const logs = { items: [] };

const match = { params: { granuleId: 'my-granule-id' } };
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

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, "useDispatch").returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
});

test.serial('CUMULUS-336 Granule file links use the correct URL', function (t) {

  const granuleOverview = shallow(
    <GranuleOverview
      dispatch={dispatch}
      match={match}
      executions={{}}
      granules={granules}
      logs={logs}
      recoveryStatus={{}}
      skipReloadOnMount={true}
      workflowOptions={[]}
    />);

  const sortableTable = granuleOverview.find('SortableTable')
  t.is(sortableTable.length, 1);
  const sortableTableWrapper = sortableTable.dive();
  t.is(sortableTableWrapper
    .find('.tbody .tr')
    .find('Cell').at(1).dive()
    .find('a[href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name"]').length, 1);
});

test.serial('Checking granule for size prop', function (t) {
  const granuleOverview = shallow(
    <GranuleOverview
      dispatch={dispatch}
      match={match}
      executions={{}}
      granules={granules}
      logs={logs}
      recoveryStatus={{}}
      skipReloadOnMount={true}
      workflowOptions={[]}
    />);

  const sortableTable = granuleOverview.find('SortableTable');
  t.is(sortableTable.length, 1);
  const sortableTableWrapper = sortableTable.dive();
  t.is(sortableTableWrapper
    .find('.tbody .tr .td')
    .find('Cell').at(2).dive()
    .text(), '10239');
});