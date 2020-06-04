'use strict';

import test from 'ava';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, configure } from 'enzyme';

import { ReconciliationReport } from '../../../app/src/js/components/ReconciliationReports/reconciliation-report';

configure({ adapter: new Adapter() });

const reconciliationReports = {
  map: {
    exampleReport: {
      data: {
        reportStartTime: '2018-06-11T18:52:37.710Z',
        reportEndTime: '2018-06-11T18:52:39.893Z',
        status: 'SUCCESS',
        error: null,
        okFileCount: 21,
        filesInCumulus: {
          okCount: 129,
          onlyInS3: [
            's3://some-bucket/path/to/key-1.hdf',
            's3://some-bucket/path/to/key-2.hdf'
          ],
          onlyInDynamoDb: [
            {
              uri: 's3://some-bucket/path/to/key-123.hdf',
              granuleId: 'g-123'
            },
            {
              uri: 's3://some-bucket/path/to/key-456.hdf',
              granuleId: 'g-456'
            }
          ],
        },
        collectionsInCumulusCmr: {
          okCount: 1
        },
        granulesInCumulusCmr: {
          okCount: 7
        },
        filesInCumulusCmr: {
          okCount: 4
        }
      }
    },
    exampleReportWithError: {
      data: {
        error: 'error creating report'
      }
    }
  }
};

test('shows an individual report', function (t) {
  const match = { params: { reconciliationReportName: 'exampleReport' } };

  const dispatch = () => {};

  const report = shallow(
    <ReconciliationReport
      match={match}
      reconciliationReports={reconciliationReports}
      dispatch={dispatch}
    />
  );

  t.is(report.length, 1);

  const TableCards = report.find('TableCards');
  t.is(TableCards.length, 2);
  const TableCardWrapper = TableCards.at(0).dive();
  const Cards = TableCardWrapper.find('Card');

  // there should be one card for DynamoDB and one card for S3
  t.is(Cards.length, 2);

  const Table = report.find('SortableTable');
  t.is(Table.length, 1);
});

test('report with error triggers error message', function (t) {
  const match = { params: { reconciliationReportName: 'exampleReportWithError' } };

  const dispatch = () => {};

  const report = shallow(
    <ReconciliationReport
      match={match}
      reconciliationReports={reconciliationReports}
      dispatch={dispatch}
    />
  );

  t.is(report.length, 1);
  const ErrorReport = report.find('ErrorReport');
  const props = ErrorReport.props();
  t.is(props.report, reconciliationReports.map.exampleReportWithError.data.error);
  t.is(ErrorReport.dive().find('div p').text(), reconciliationReports.map.exampleReportWithError.data.error);
});
