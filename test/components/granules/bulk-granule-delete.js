'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import BulkGranuleDelete from '../../../app/src/js/components/Granules/bulk-granule-delete.js';

configure({ adapter: new Adapter() });

test('bulk delete granule modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';

  const bulkGranuleDeleteModal = shallow(
    <BulkGranuleDelete
      asyncOpId={asyncOpId}
      inflight={false}
      success={true}
    />
  );

  const successMessage = bulkGranuleDeleteModal.find('.message__success');
  t.is(successMessage.length, 1);
  t.true(successMessage.find('p').text().includes(asyncOpId));
  t.false(bulkGranuleDeleteModal.exists('.form__bulkgranules'));
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('cancelButtonText'),
    'Close'
  );
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('confirmButtonText'),
    'Go To Operations'
  );
});

test('bulk delete granule modal shows submission form', function (t) {
  const bulkGranuleDeleteModal = shallow(
    <BulkGranuleDelete
      inflight={false}
      success={false}
    />
  );

  t.true(bulkGranuleDeleteModal.exists('.form__bulkgranules'));
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('confirmButtonText'),
    'Run Bulk Delete'
  );
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('cancelButtonText'),
    'Cancel Bulk Delete'
  );
});

test('bulk delete granule modal shows inflight status', function (t) {
  const bulkGranuleDeleteModal = shallow(
    <BulkGranuleDelete
      inflight={true}
      success={false}
    />
  );

  t.true(bulkGranuleDeleteModal.exists('.form__bulkgranules'));
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('confirmButtonText'),
    'loading...'
  );
  t.is(
    bulkGranuleDeleteModal.find('DefaultModal').prop('cancelButtonText'),
    'Cancel Bulk Delete'
  );
});
