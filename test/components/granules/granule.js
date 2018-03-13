'use strict';

import test from 'tape';
import Adapter from 'enzyme-adapter-react-15';
import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import { createMockStore } from 'redux-test-utils';

import GranuleOverview from '../../../app/scripts/components/granules/granule.js';
import SortableTable from '../../../app/scripts/components/table/sortable';

configure({ adapter: new Adapter() });

test('test <GranuleOverview /> component', function (t) {
  const state = {
    granules: {
      map: {
        'my-granule-id': {
          data: {
            name: 'my-name',
            filename: 'my-filename',
            bucket: 'my-bucket',
            status: 'success',
            files: [
              {
                name: 'my-name',
                filename: 's3://my-bucket/my-key-path/my-name',
                bucket: 'my-bucket'
              }
            ]
          }
        }
      }
    },
    logs: {
      items: []
    }
  };

  const params = {
    granuleId: 'my-granule-id'
  };

  const wrapper = shallow(<GranuleOverview params={params} />, {
    context: {
      store: createMockStore(state)
    }
  });

  // const blah = shallow(<div><a href='asdf'>hello</a></div>);

  // console.log(blah.find('a[href="asdf"]'));

  console.log(wrapper.find('div'));

  // console.log(wrapper.find('.page__component'));

  // console.log(wrapper.html());

  // console.log(wrapper.instance());
  // console.log(wrapper.debug());

  // t.ok(wrapper.dive().containsMatchingElement(<a href="https://my-bucket.s3.amazonaws.com/my-key-path/my-name">Link</a>));

  // console.log(wrapper.html());

  // const link = wrapper.dive().find(SortableTable).dive().find('a');
  // t.equal(link.length, 1);
  // console.log(link);
  // t.ok(link);

  t.end();
});
