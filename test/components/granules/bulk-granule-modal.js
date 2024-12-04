////*************************************************************************************************************************************
////Updated by: Bryan Wexler, Rich Frausto
////Date Modified: November 19, 2024
////Project: CUMULUS-3861: Dashboard: Replace Enzyme with React Testing Library(RTL)
////Reason:  Removed references to Enzyme and replaced them with React compliant testing components. 
////Number of Test Cases: 3
////Number of Test Assertions: 15
////Test Reviewer: Bryan Wexler December 5, 2024
////*************************************************************************************************************************************

'use strict';

import test from 'ava';
import React from 'react'
import { render, screen } from '@testing-library/react'
import BulkGranuleModal from '../../../app/src/js/components/Granules/bulk-granule-modal.js'
import { Provider } from 'react-redux'
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
   getState: () => {},
   subscribe: () => {},
   timer: { running: false, seconds: -1 },
   locationQueryParams,
   dispatch
  });

//Command to execute the test: npx ava test/components/granules/bulk-granule-modal.js  
test('bulk granule modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';
  const successMessage = 'Success 1234';
  const query = {};

  
  const { container } = render(
    <Provider store={someStore}>
      <BulkGranuleModal
        asyncOpId={asyncOpId}
        inflight={false}
        success={true}
        successMessage={successMessage}
        defaultQuery={query}
        showModal={true}
        onCancel={true}
      />
    </Provider>);

  screen.debug();
  console.log(container.innerHTML);
  
  t.truthy(screen.getByText(asyncOpId));
  t.truthy(screen.findByText(successMessage));

  //React doesn't like testing for elements that don't render on the screen. Naturally, it will never find them and error with 'undefined'. 
  //This ensures the '.form__bulkgranules' element is not rendered on the screen. If it does appear, this assert and entire test will then fail with length = 1. 
  const formBulkGranules = screen.findByText('.form__bulkgranules')
  t.is(formBulkGranules.length, undefined);
  
  t.truthy(screen.findByText('cancelButtonText') && screen.findByText('Close'));
  t.truthy(screen.findByText('confirmButtonClass') && screen.findByText('button__goto'));
  t.truthy(screen.findByText('confirmButtonText') && screen.findByText('Go To Operations'));
  
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
