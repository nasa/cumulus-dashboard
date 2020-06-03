'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import BulkGranuleOperations from '../../../app/src/js/components/Granules/bulk-granule-operations.js';

configure({ adapter: new Adapter() });

test('bulk granule operations modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';

  const BulkGranuleOperationsModal = shallow(
    <BulkGranuleOperations
      asyncOpId={asyncOpId}
      inflight={false}
      success={true}
    />
  );

  const successMessage = BulkGranuleOperationsModal.find('.message__success');
  t.is(successMessage.length, 1);
  t.true(successMessage.find('p').text().includes(asyncOpId));
  t.false(BulkGranuleOperationsModal.exists('.form__bulkgranules'));
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('cancelButtonText'),
    'Close'
  );
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('confirmButtonText'),
    'Go To Operations'
  );
});

test('bulk granule operations modal shows submission form', function (t) {
  const BulkGranuleOperationsModal = shallow(
    <BulkGranuleOperations
      inflight={false}
      success={false}
    />
  );

  t.true(BulkGranuleOperationsModal.exists('.form__bulkgranules'));
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('confirmButtonText'),
    'Run Bulk Operations'
  );
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('cancelButtonText'),
    'Cancel Bulk Operations'
  );
});

test('bulk granule operations modal shows inflight status', function (t) {
  const BulkGranuleOperationsModal = shallow(
    <BulkGranuleOperations
      inflight={true}
      success={false}
    />
  );

  t.true(BulkGranuleOperationsModal.exists('.form__bulkgranules'));
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('confirmButtonText'),
    'loading...'
  );
  t.is(
    BulkGranuleOperationsModal.find('DefaultModal').prop('cancelButtonText'),
    'Cancel Bulk Operations'
  );
});
