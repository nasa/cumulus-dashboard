'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { InactivityModal } from '../../../app/src/js/components/Modal/InactivityModal';

configure({ adapter: new Adapter() });

test('should render modal when hasModal is true', t => {
  const showModal = setInterval(() => {
    if (Date.now() - lastKeyPress > 1800000 && !hasModal) { // 1800000 ms = 30 minutes
      showModal(true);
    }
  }, 60000); // Check every minute (60000 ms)

  // Create a shallow render of the component
  const wrapper = shallow(<InactivityModal
    showModal={showModal}
    />);

// test('should render modal when hasModal is true', t => {
//   const onCancel = () => {  }

//   // Create a shallow render of the component
//   const wrapper = shallow(<inactivityModal
//     onCancel={handleLogout}
//     onCloseModal={closeModal}
//     onConfirm={handleConfirm}
//     showModal={hasModal}
//     hasConfirmButton={hasModal}
//     />);

  // Set state to show the modal
  wrapper.setState({ hasModal: true } );

  // Check if the modal exists in the rendered output
  t.true(wrapper.find('.default-modal').exists(), 'Modal should be present when hasModal is true');

});

// test('should not render when modal when hasModal is false', t => {

//   // create a shallow render of the component
//   const wrapper = shallow(<inactivityModal />);

//   // ensure the modal is not showing
//   t.false(wrapper.find('.default-modal').exists(), 'Modal should not be present when hasModal is false');

// });