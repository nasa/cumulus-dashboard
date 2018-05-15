'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { connect } from 'react-redux';
import { shallowWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

import BatchCommand from '../../../app/scripts/components/form/batch-async-command.js';

configure({ adapter: new Adapter() });

test('collect multiple errors', function (t) {
  const noop = () => {}

  const onSuccess = (result) => {
    console.log(result)
  };

  const onError = (err) => {
    console.log(err)
  };

  const action = (id) => {
    item.state[id] = {
      status: id.contains('error') ? 'error' : 'success'
    }

    command.newProps(item)
  }

  const item = {
    text: 'Example',
    action: action,
    state: {},
    confirm: noop
  }

  const selected = [
    '0-error',
    '1-pass',
    '2-error',
    '3-pass'
  ];

  const command = shallow(
    <BatchCommand
      key={item.text}
      dispatch={noop}
      action={item.action}
      state={item.state}
      text={item.text}
      confirm={item.confirm}
      onSuccess={onSuccess}
      onError={onError}
      selection={selected}
    />
  );

  console.log(command.state())

  // const sortableTable = granuleOverview.find('SortableTable');
  // t.is(sortableTable.length, 1);
  // const sortableTableWrapper = sortableTable.dive();
  // t.is(sortableTableWrapper.find('tbody tr td a[href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name"]').length, 1);
});
