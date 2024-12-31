'use strict';

import test from 'ava';
import { render, fireEvent } from '@testing-library/react'
import React from 'react';

import { BatchCommand } from '../../../app/src/js/components/BatchAsyncCommands/BatchAsyncCommands';

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

    const { container } = render(
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

    fireEvent.click(container.querySelector('.button__group'));
    setTimeout(()=> {
      t.end();
    }, 1000);
  });
