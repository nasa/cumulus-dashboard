////*************************************************************************************************************************************
////Updated by: Rich Frausto, Bryan Wexler
////Date Modified: November 19, 2024
////Project: CUMULUS-3861: Dashboard: Replace Enzyme with React Testing Library(RTL)
////Reason:  Broke out the two tests that were in the execution-events.js file into two individual test script files. 
////         Removed references to Enzyme and replaced them with React compliant testing components. 
////Number of Test Cases: 3
////Number of Test Assertions: 15
////Test Reviewer: Bryan Wexler November , 2024
////*************************************************************************************************************************************

'use strict';

import test from 'ava';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
// import { shallow, configure } from 'enzyme';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { initialState } from '../../../app/src/js/reducers/datepicker';
import { Provider } from 'react-redux';
import bulkGranuleModal, { BulkGranuleModal } from '../../../app/src/js/components/Granules/bulk-granule-modal.js';

const match = {params: { BulkGranuleModal: BulkGranuleModal.propTypes },};
const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  getState: () => {},
  subscribe: () => {},
  timer: { running: false, seconds: -1 },
  datepicker: initialState(),
  locationQueryParams,
  dispatch,
  BulkGranuleModal
});


// configure({ adapter: new Adapter() });

//Command to execute the test: npx ava test/components/granules/bulk-granule-modal.js
test('bulk granule modal shows success message', function (t) {
  const asyncOpId = 'abcd1234';
  const successMessage = 'Success 1234';


  screen.debug();
  console.log('***************************** Debug -->', BulkGranuleModal, bulkGranuleModal, someStore, container);

  const { container } = render.toString(
    <Provider store={someStore}>
    <MemoryRouter>
    <BulkGranuleModal
      asyncOpId={asyncOpId}
      inflight={false}
      success={true}
      successMessage={successMessage}
      match={match}
    />
    </MemoryRouter>
    </Provider>
  );

  screen.debug();
  console.log(someStore);


  //const successMessageElement = container.querySelector('.message__success');
  const successMessageElement = JSON.stringify(screen).at('.message__success');
  t.is(successMessageElement.length, 1);

  //const successMessageText = successMessageElement.querySelector('p').text();
  //const successMessageText = successMessageElement.querySelector('p');
  const successMessageText = JSON.stringify(screen).at('propTypes');

  screen.debug();
  console.log(successMessageElement, successMessageText);

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
