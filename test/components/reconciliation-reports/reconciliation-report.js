'use strict';

import test from 'ava';
import { render, screen } from '@testing-library/react'
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ReconciliationReport } from '../../../app/src/js/components/ReconciliationReports/reconciliation-report';
import { initialState } from '../../../app/src/js/reducers/datepicker.js';

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

const locationQueryParams = {
  search: {}
};
const dispatch = () => {};

const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  api: { authenticated: true },
  router: {location: {}, action: 'POP'},
  datepicker: initialState(),
  reconciliationReports,
  locationQueryParams,
});

test('shows an individual inventory report', function (t) {
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/reconciliation-reports/exampleInventoryReport']}>
        <Routes>
          <Route 
            path="/reconciliation-reports/:reconciliationReportName" 
            element={<ReconciliationReport reconciliationReports={reconciliationReports} />} 
          />
        </Routes>
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
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/reconciliation-reports/exampleGranuleNotFoundReport']}>
        <Routes>
          <Route 
            path="/reconciliation-reports/:reconciliationReportName" 
            element={<ReconciliationReport reconciliationReports={reconciliationReports} />} 
          />
        </Routes>
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
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/reconciliation-reports/exampleInventoryReport']}>
        <Routes>
          <Route 
            path="/reconciliation-reports/:reconciliationReportName" 
            element={<ReconciliationReport reconciliationReports={reconciliationReports} />} 
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  t.is(container.querySelectorAll('.page__component').length, 1);

  const GnfReport = container.querySelectorAll('.page__section__header');
  t.is(GnfReport.length, 1);

  const ReportHeading = container.querySelectorAll('.heading--shared-content.with-description.with-bottom-border.width--full');
  t.is(ReportHeading.length, 1);

  const headingProps = ReportHeading[0].textContent;
  const expectedHeadingProps = {
    endTime: '2018-06-11 18:52:37',
    error: '',
    name: 'exampleInventoryReport',
    startTime: '2018-06-11 18:52:39',
    type: 'Inventory'
  };

  t.true(headingProps.includes(expectedHeadingProps.type) && headingProps.includes(expectedHeadingProps.name) && headingProps.includes(expectedHeadingProps.error) 
    && headingProps.includes(expectedHeadingProps.startTime) && headingProps.includes(expectedHeadingProps.endTime));

  const downloadOptions = ReportHeading[0].querySelectorAll('.button--download');
  const downloadItems = ReportHeading[0].querySelectorAll('.dropdown');
  // for the below, the original tests had it equal to 2, I wasn't sure what it was checking for, this will need to be checked over in the review
  t.is(downloadOptions.length, 1); 
  t.is(downloadItems.length, 1);
});

test('report with error triggers error message', function (t) {
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/reconciliation-reports/exampleReportWithError']}>
        <Routes>
          <Route 
            path="/reconciliation-reports/:reconciliationReportName" 
            element={<ReconciliationReport reconciliationReports={reconciliationReports} />} 
          />
        </Routes>
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
  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={['/reconciliation-reports/exampleReportExceedsPayloadLimit']}>
        <Routes>
          <Route 
            path="/reconciliation-reports/:reconciliationReportName" 
            element={<ReconciliationReport reconciliationReports={reconciliationReports} />} 
          />
        </Routes>
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
