'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { configure, mount } from 'enzyme';

import { BatchCommand } from '../../../app/src/js/components/BatchAsyncCommands/BatchAsyncCommands';

configure({ adapter: new Adapter() });

test.cb('collect multiple errors', function (t) {
  const noop = () => {};

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
        t.end();
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
        command.update();
      });
    };

    const cleanup = () => {
      console.log('Cleanup called');
    };

    const item = {
      text: 'Example',
      action: action,
      state: {},
      confirm: noop
    };

    const command = mount(
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
        cleanup={cleanup}
      />
    );

    command.find('AsyncCommand').props().action();
    setTimeout(()=> {
      command.update();
      command.find('BatchCommand').props().cleanup();
      t.end();
    }, 1000);
  });
