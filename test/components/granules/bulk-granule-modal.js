'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';

import { BulkGranuleModal } from '../../../app/src/js/components/Granules/bulk-granule-modal.js';

// configure({ adapter: new Adapter() });

test('bulk granule modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';
  const successMessage = 'Success 1234';

  const { container } = render(
    <BulkGranuleModal
      asyncOpId={asyncOpId}
      inflight={false}
      success={true}
      successMessage={successMessage}
    />
  );

  screen.debug();
  console.log(container.innerHTML);

  const successMessageElement = container.querySelector('.message__success');
  t.is(successMessageElement.length, 1);
  const successMessageText = successMessageElement.querySelector('p').text();
  t.true(successMessageText.includes(successMessage));
  t.true(successMessageText.includes(asyncOpId));
  t.false(container.exists('.form__bulkgranules'));
  t.is(
    modal.querySelector('DefaultModal').prop('cancelButtonText'),
    'Close'
  );
  t.is(
    modal.querySelector('DefaultModal').prop('confirmButtonClass'),
    'button__goto'
  );
  t.is(
    modal.querySelector('DefaultModal').prop('confirmButtonText'),
    'Go To Operations'
  );
});

// test('bulk granule modal shows submission form', function (t) {
//   const cancelButtonText = 'Cancel';
//   const confirmButtonClass = 'confirm-class';
//   const confirmButtonText = 'Confirm';

//   const modal = render(
//     <BulkGranuleModal
//       cancelButtonText={cancelButtonText}
//       confirmButtonClass={confirmButtonClass}
//       confirmButtonText={confirmButtonText}
//       inflight={false}
//       success={false}
//     >
//       <div id="test5678">TEST</div>
//     </BulkGranuleModal>
//   );

//   t.true(modal.exists('.form__bulkgranules'));
//   t.is(modal.querySelector('#test5678').text(), 'TEST');
//   t.is(
//     modal.querySelector('DefaultModal').prop('cancelButtonText'),
//     cancelButtonText
//   );
//   t.is(
//     modal.querySelector('DefaultModal').prop('confirmButtonClass'),
//     confirmButtonClass
//   );
//   t.is(
//     modal.querySelector('DefaultModal').prop('confirmButtonText'),
//     confirmButtonText
//   );
// });

// test('bulk granule modal shows inflight status', function (t) {
//   const cancelButtonText = 'Cancel';
//   const confirmButtonClass = 'confirm-class';

//   const modal = render(
//     <BulkGranuleModal
//       cancelButtonText={cancelButtonText}
//       confirmButtonClass={confirmButtonClass}
//       inflight={true}
//       success={false}
//     >
//       <div id="test9102">TEST2</div>
//     </BulkGranuleModal>
//   );

//   t.true(modal.exists('.form__bulkgranules'));
//   t.is(modal.querySelector('#test9102').text(), 'TEST2');
//   t.is(
//     modal.querySelector('DefaultModal').prop('cancelButtonText'),
//     cancelButtonText
//   );
//   t.is(
//     modal.querySelector('DefaultModal').prop('confirmButtonClass'),
//     confirmButtonClass
//   );
//   t.is(
//     modal.querySelector('DefaultModal').prop('confirmButtonText'),
//     'loading...'
//   );
// });
