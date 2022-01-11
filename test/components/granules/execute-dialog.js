'use strict';

import test from 'ava';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, configure } from 'enzyme';

import SimpleDropDown from '../../../app/src/js/components/DropDown/simple-dropdown';
import TextArea from '../../../app/src/js/components/TextAreaForm/text-area';
import { executeDialog } from '../../../app/src/js/utils/table-config/granules';

configure({ adapter: new Adapter() });

test('CUMULUS-2108 executeDialog renders expected components', function (t) {
  const store = {
    getState: () => {},
    dispatch: () => {},
    subscribe: () => {}
  };  

  const element = shallow(
    <Provider store={store}>
      {executeDialog({
        selectHandler: () => {},
        label: 'workflow-dropdown',
        value: 'workflow',
        options: [],
        initialMeta: {},
        metaHandler: () => {},
      })}
    </Provider>
  )

  t.is(element.find(SimpleDropDown).length, 1);
  t.is(element.find(TextArea).length, 1);
});
