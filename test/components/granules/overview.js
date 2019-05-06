'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import { shallow, configure } from 'enzyme';
import { GranulesOverview } from '../../../app/scripts/components/granules/overview';
import { List } from '../../../app/scripts/components/table/list-view';

configure({ adapter: new Adapter() });

test('Overview renders bulkAction buttons without recovery button', function (t) {
  const granules = {
    /* reingested: false,
    executed: false,
    removed: false,
    deleted: false,
    recovered: false, */
    list: {
      meta: {
        count: 12,
        queriedAt: 0
      }
    },
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
  const dispatch = () => {};
  const workflowOptions = [];
  const stats = { count: 0, histogram: {}, stats: {} };
  const location = { pathname: 'granules' };
  const config = { recoveryPath: 'recover' };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const overviewWrapper = shallow(
    //<Provider store={store}>
      <GranulesOverview
        granules = {granules}
        stats = {stats}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        location = {location}
        config={config}/>);
    //</Provider>);

  // granulesOverview.setState({ config: { recoveryPath: 'recover' } });
  console.log(overviewWrapper.props());
  console.log(overviewWrapper.find('.filters').length);
});
