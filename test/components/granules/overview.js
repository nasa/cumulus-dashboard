'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'jsdom-global/register';
import { Provider } from 'react-redux';
import { shallow, configure } from 'enzyme';
import sinon from 'sinon';
import { GranulesOverview } from '../../../app/src/js/components/Granules/overview';

configure({ adapter: new Adapter() });

const granules = {
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
const data = {
  data: 'granuleUr","collectionId","createdAt","startDateTime","endDateTime" "MOD09GQ.A1657416.CbyoRi.006.9697917818587","MOD09GQ___006","2018-09-24T23:28:43.341Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z" "MOD09GQ.A0142558.ee5lpE.006.5112577830916","MOD09GQ___006","2018-09-24T17:53:10.359Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z" "MOD09GQ.A2417309.YZ9tCV.006.4640974889044","MOD09GQ___006","2018-09-24T23:09:52.105Z","","" "MOD09GQ.A8022119.sk3Sph.006.0494433853533","MOD09GQ___006","2018-09-24T17:38:15.121Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z" "MOD09GQ.A9344328.K9yI3O.006.4625818663028","MOD09GQ___006","2018-09-24T17:29:51.858Z","","" "MOD09GQ.A4622742.B7A8Ma.006.7857260550036","MOD09GQ___006","2019-12-11T23:19:23.823Z","2017-10-24T00:00:00Z","2017-11-08T23:59:59Z" "MOD09GQ.A5456658.rso6Y4.006.4979096122140","MOD09GQ___006","2018-09-24T23:11:06.647Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z" "MOD09GQ.A1530852.CljGDp.006.2163412421938","MOD09GQ___006","2018-09-24T23:29:16.154Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z" "MOD09GQ.A2016358.h13v04.006.2016360104606.hdf","MOD09GQ___006","2018-09-24T23:27:50.335Z","","" "MOD09GQ.A2016358.h13v04.006.2016360104606","MOD09GQ___006","2018-11-12T20:05:10.348Z","","" "MOD09GQ.A0501579.PZB_CG.006.8580266395214","MOD09GQ___006","2018-09-24T17:52:32.232Z","2017-10-24T00:00:00.000Z","2017-11-08T23:59:59.000Z"',
  inflight: false,
  error: null
};

test('GranulesOverview generates bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const workflowOptions = [];
  const stats = { count: 0, stats: {} };
  const location = { pathname: 'granules' };
  const config = { enableRecovery: true };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        granuleCSV = {data}
        stats = {stats}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        location = {location}
        config={config}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('Connect(List)');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 1);
});

test('GranulesOverview does not generate bulkAction for recovery button', function (t) {
  const dispatch = () => {};
  const workflowOptions = [];
  const stats = { count: 0, stats: {} };
  const location = { pathname: 'granules' };
  const config = { enableRecovery: false };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        stats = {stats}
        granuleCSV = {data}
        dispatch = {dispatch}
        workflowOptions = {workflowOptions}
        location = {location}
        config={config}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();
  const listWrapper = overviewWrapper.find('Connect(List)');
  const listBulkActions = listWrapper.prop('bulkActions');

  const recoverFilter = (object) => object.text === 'Recover Granule';
  const recoverActionList = listBulkActions.filter(recoverFilter);
  t.is(recoverActionList.length, 0);
});

test('GranulesOverview will download CSV data when the Download Granule List button is clicked and not leave extra link on the page', function (t) {
  window.URL.createObjectURL = sinon.fake.returns('www.example.com');
  const dispatch = () => Promise.resolve();
  const workflowOptions = [];
  const config = { enableRecovery: false };
  const store = {
    subscribe: () => {},
    dispatch: dispatch,
    getState: () => {}
  };

  const providerWrapper = shallow(
    <Provider store={store}>
      <GranulesOverview
        granules = {granules}
        granuleCSV = {data}
        dispatch = {dispatch}
        location = {location}
        workflowOptions = {workflowOptions}
        config={config}/>
    </Provider>);

  const overviewWrapper = providerWrapper.find('GranulesOverview').dive();

  const granuleCSVButton = overviewWrapper.find('a.csv__download');
  granuleCSVButton.simulate('click');

  // should not leave extra link on the page
  const downloadLink = overviewWrapper.find('a[href="www.example.com"]');
  t.is(downloadLink.length, 0);
});
