'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { GranuleOverview } from '../../../app/src/js/components/Granules/granule.js';

configure({ adapter: new Adapter() });

test('CUMULUS-336 Granule file links use the correct URL', function (t) {
  const granules = {
    map: {
      'my-granule-id': {
        data: {
          name: 'my-name',
          filename: 'my-filename',
          bucket: 'my-bucket',
          status: 'success',
          files: [
            {
              fileName: 'my-name',
              key: 'my-key-path/my-name',
              bucket: 'my-bucket'
            }
          ]
        }
      }
    }
  };

  const logs = { items: [] };

  const match = { params: { granuleId: 'my-granule-id' } };

  const dispatch = () => {};

  const granuleOverview = shallow(
    <GranuleOverview
      dispatch={dispatch}
      match={match}
      granules={granules}
      logs={logs}
      skipReloadOnMount={true}
    />
  );

  const sortableTable = granuleOverview.find('SortableTable');
  t.is(sortableTable.length, 1);
  const sortableTableWrapper = sortableTable.dive();
  t.is(sortableTableWrapper
    .find('.tbody .tr')
    .find('Cell').at(1).dive()
    .find('a[href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name"]').length, 1);
});
