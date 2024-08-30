'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { inactivityModal } from '../../../app/src/js/components/Modal/inactivityModal';

configure({ adapter: new Adapter() });

test('should render modal when hasModal is true', t => {

  // Create a shallow render of the component
  const wrapper = shallow(<inactivityModal />);

  // Set state to show the modal
  wrapper.setState({ hasModal: true } );

  // Check if the modal exists in the rendered output
  t.true(wrapper.find('.default-modal').exists(), 'Modal should be present when hasModal is true');

});

test('should not render when modal when hasModal is false', t => {

  // create a shallow render of the component
  const wrapper = shallow(<inactivityModal />);

  // ensure the modal is not showing
  t.false(wrapper.find('.default-modal').exists(), 'Modal should not be present when hasModal is false');

});