'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ReconciliationReport } from '../../../app/src/js/components/ReconciliationReports/reconciliation-report';

const reconciliationReports = {
  map: {
    exampleInventoryReport: {
      data: {
        presignedS3Url: 'https://example.amazonaws.com/example',
        data: {
          reportStartTime: '2018-06-11T18:52:37.710Z',
          reportEndTime: '2018-06-11T18:52:39.893Z',
          status: 'SUCCESS',
          error: null,
          reportType: 'Inventory',
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
    },
    exampleGranuleNotFoundReport: {
      data: {
        presignedS3Url: 'https://example.amazonaws.com/example',
        data: {
          createStartTime: '2018-06-11T18:52:37.710Z',
          createEndTime: '2018-06-11T18:52:39.893Z',
          status: 'SUCCESS',
          error: null,
          reportType: 'Granule Not Found',
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
    },
    exampleReportWithError: {
      data: {
        error: 'error creating report'
      }
    },
    exampleReportExceedsPayloadLimit: {
      data: {
        presignedS3Url: 'https://example.amazonaws.com/example',
        data: 'Error: Report examplereport exceeded maximum allowed payload size',
      }
    }
  },
  list: {
    params: {}
  }
};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  locationQueryParams: {
    search: {}
  },
});

const locationQueryParams = {
  search: {}
};
const dispatch = () => {};

test('shows an individual inventory report', function (t) {
  const match = { params: { reconciliationReportName: 'exampleInventoryReport' } };

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <ReconciliationReport
      dispatch={dispatch}
      match={match}
      reconciliationReports={reconciliationReports}
      locationQueryParams={locationQueryParams}
    />
    </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const InventoryReport = container.querySelectorAll('.page__section__header');
  t.is(InventoryReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  const TableCards = container.querySelectorAll('.table-card');
  t.is(TableCards.length, 2);

  const Cards = container.querySelectorAll('.card-wrapper');
  t.is(Cards.length, 2);

  const Table = container.querySelectorAll('.list__wrapper');
  t.is(Table.length, 1);
});

test('shows an individual Granule Not Found report', function (t) {
  const match = { params: { reconciliationReportName: 'exampleGranuleNotFoundReport' } };

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <ReconciliationReport
      dispatch={dispatch}
      match={match}
      reconciliationReports={reconciliationReports}
    />
    </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const GnfReport = container.querySelectorAll('.page__section__header');
  t.is(GnfReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  const Table = container.querySelectorAll('.list__wrapper');
  t.is(Table.length, 1);
});

test('correctly renders the heading', function (t) {
  const match = { params: { reconciliationReportName: 'exampleInventoryReport' } };

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <ReconciliationReport
      dispatch={dispatch}
      match={match}
      reconciliationReports={reconciliationReports}
    />
    </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const GnfReport = container.querySelectorAll('.page__section__header');
  t.is(GnfReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  /*
  STILL TO DO:


  const { downloadOptions, ...headingProps } = ReportHeading.props();

  const expectedHeadingProps = {
    endTime: '2018-06-11T18:52:39.893Z',
    error: null,
    name: 'exampleInventoryReport',
    startTime: '2018-06-11T18:52:37.710Z',
    type: 'Inventory'
  };

  t.is(downloadOptions.length, 2);

  t.deepEqual(headingProps, expectedHeadingProps);

  const reportHeadingWrapper = ReportHeading.dive();

  const downloadItems = reportHeadingWrapper.find('DropdownItem');
  t.is(downloadItems.length, 2);
  */
});

test('report with error triggers error message', function (t) {
  const match = { params: { reconciliationReportName: 'exampleReportWithError' } };

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <ReconciliationReport
      dispatch={dispatch}
      match={match}
      reconciliationReports={reconciliationReports}
      locationQueryParams={locationQueryParams}
    />
    </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const InventoryReport = container.querySelectorAll('.page__section__header');
  t.is(InventoryReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  const ErrorReport = container.querySelector('.error__report');
  t.true(ErrorReport.textContent.includes(reconciliationReports.map.exampleReportWithError.data.error)); //this is odd, need to revisit
  t.is(ErrorReport.querySelector('p').textContent, reconciliationReports.map.exampleReportWithError.data.error);
});

test('report which exceeds maximum allowed payload size triggers error message', function (t) {
  const match = { params: { reconciliationReportName: 'exampleReportExceedsPayloadLimit' } };

  const { container } = render(
    <Provider store={someStore}>
    <MemoryRouter>
    <ReconciliationReport
      dispatch={dispatch}
      match={match}
      reconciliationReports={reconciliationReports}
      locationQueryParams={locationQueryParams}
    />
    </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const InventoryReport = container.querySelectorAll('.page__section__header');
  t.is(InventoryReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  const ErrorReport = container.querySelector('.error__report');

  const errorMessage = reconciliationReports.map.exampleReportExceedsPayloadLimit.data.data;
  t.true(ErrorReport.textContent.includes(errorMessage));
  t.true(ErrorReport.querySelector('p').textContent.includes(errorMessage));
});
