'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { configure, shallow } from 'enzyme';

import { BatchCommand } from '../../../app/src/js/components/BatchAsyncCommands/BatchAsyncCommands';

configure({ adapter: new Adapter() });

test('collect multiple errors', function (t) {
  const noop = () => {};

  return new Promise((resolve, reject) => {
    const selected = [
      '0-error',
      '1-pass',
      '2-error',
      '3-pass'
    ];

    let count = 0;
    const done = () => {
      count++;
      if (count === 2) {
        resolve();
      }
    };

    const onSuccess = (result) => {
      t.is(result.filter((item) => !!item).length, 2);
      done();
    };

    const onError = (err) => {
      t.is(err.indexOf('2 error(s) occurred'), 0);
      done();
    };

    const action = (id) => {
      if (id.indexOf('error') > 0) {
        item.state[id] = {
          status: 'error',
          error: `there was a problem with ${id}`
        };
      } else {
        item.state[id] = {
          status: 'success'
        };
      }

      process.nextTick(() => {
        command.setProps(item);
      });
    };

    const item = {
      text: 'Example',
      action: action,
      state: {},
      confirm: noop
    };

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
        selected={selected}
      />
    );

    command.instance().start();
    setTimeout(()=> {
      command.instance().cleanup();
    }, 1000)
  });
});
