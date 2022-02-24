'use strict';

import test from 'ava';
import { get } from 'object-path';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { shallow, configure } from 'enzyme';
import { BulkGranule } from '../../../app/src/js/components/Granules/bulk.js';
import { constructCollectionId } from '../../../app/src/js/utils/format.js';

configure({ adapter: new Adapter() });

const granules = {};
const dispatch = () => { };

test('BulkGranule does not generate button for bulk recovery when recovery is not enabled', function (t) {
  const configWithRecovery = { enableRecovery: false };
  const bulkGranuleWrapper = shallow(
    <BulkGranule
      dispatch={dispatch}
      config={configWithRecovery}
      confirmAction={true}
      element='button'
      className='button button__bulkgranules'
      granules={granules}
    />);

  const buttons = bulkGranuleWrapper.find('button');
  const buttonsProps = buttons.map((button) => button.props())
  const recoverFilter = (object) => object.children === 'Run Bulk Recovery';
  const recoveryButtonsProps = buttonsProps.filter(recoverFilter);
  t.is(recoveryButtonsProps.length, 0);
});

test('BulkGranule generates button for bulk recovery when recovery is enabled', function (t) {
  const configWithRecovery = { enableRecovery: true };
  const bulkGranuleWrapper = shallow(
    <BulkGranule
      dispatch={dispatch}
      config={configWithRecovery}
      confirmAction={true}
      element='button'
      className='button button__bulkgranules'
      granules={granules}
    />);

  const buttons = bulkGranuleWrapper.find('button');
  const buttonsProps = buttons.map((button) => button.props())
  const recoverFilter = (object) => object.children === 'Run Bulk Recovery';
  const recoveryButtonsProps = buttonsProps.filter(recoverFilter);
  t.is(recoveryButtonsProps.length, 1);
});
