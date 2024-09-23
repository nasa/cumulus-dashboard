'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { InactivityModal } from '../../../app/src/js/components/Modal/InactivityModal';

configure({ adapter: new Adapter() });

test('Inactivity Modal should render when hasModal is true', function (t) {
  const hasModal = true ;
  const hasCancelButton = 'button--cancel';
  const hasConfirmButton = 'button--submit';

  // Create a shallow render of the component
  const modal = shallow(
      <InactivityModal
        hasModal={hasModal}
        hasCancelButton={hasCancelButton}
        hasConfirmButton={hasConfirmButton}
      />
  );
  t.true(modal.find('DefaultModal').exists(),'Modal should be present when hasModal is true');
  t.is(modal.find('DefaultModal').prop('hasCancelButton'), true);
  t.is(modal.find('DefaultModal').prop('hasConfirmButton'), true);
});
