'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { BulkGranuleModal } from '../../../app/src/js/components/Granules/bulk-granule-modal.js';

configure({ adapter: new Adapter() });

test('bulk granule modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';
  const successMessage = 'Success 1234';

  const modal = shallow(
    <BulkGranuleModal
      asyncOpId={asyncOpId}
      inflight={false}
      success={true}
      successMessage={successMessage}
    />
  );

  const successMessageElement = modal.find('.message__success');
  t.is(successMessageElement.length, 1);
  const successMessageText = successMessageElement.find('p').text();
  t.true(successMessageText.includes(successMessage));
  t.true(successMessageText.includes(asyncOpId));
  t.false(modal.exists('.form__bulkgranules'));
  t.is(
    modal.find('DefaultModal').prop('cancelButtonText'),
    'Close'
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonClass'),
    'button__goto'
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonText'),
    'Go To Operations'
  );
});

test('bulk granule modal shows submission form', function (t) {
  const cancelButtonText = 'Cancel';
  const confirmButtonClass = 'confirm-class';
  const confirmButtonText = 'Confirm';

  const modal = shallow(
    <BulkGranuleModal
      cancelButtonText={cancelButtonText}
      confirmButtonClass={confirmButtonClass}
      confirmButtonText={confirmButtonText}
      inflight={false}
      success={false}
    >
      <div id="test5678">TEST</div>
    </BulkGranuleModal>
  );

  t.true(modal.exists('.form__bulkgranules'));
  t.is(modal.find('#test5678').text(), 'TEST');
  t.is(
    modal.find('DefaultModal').prop('cancelButtonText'),
    cancelButtonText
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonClass'),
    confirmButtonClass
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonText'),
    confirmButtonText
  );
});

test('bulk granule modal shows inflight status', function (t) {
  const cancelButtonText = 'Cancel';
  const confirmButtonClass = 'confirm-class';

  const modal = shallow(
    <BulkGranuleModal
      cancelButtonText={cancelButtonText}
      confirmButtonClass={confirmButtonClass}
      inflight={true}
      success={false}
    >
      <div id="test9102">TEST2</div>
    </BulkGranuleModal>
  );

  t.true(modal.exists('.form__bulkgranules'));
  t.is(modal.find('#test9102').text(), 'TEST2');
  t.is(
    modal.find('DefaultModal').prop('cancelButtonText'),
    cancelButtonText
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonClass'),
    confirmButtonClass
  );
  t.is(
    modal.find('DefaultModal').prop('confirmButtonText'),
    'loading...'
  );
});
