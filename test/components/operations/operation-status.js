'use strict';

import test from 'ava';
import React from 'react';
import * as redux from 'react-redux';
import * as router from 'react-router-dom';
import sinon from 'sinon';
import OperationStatus from '../../../app/src/js/components/Operations/operation-status';
import asyncOperationsFixture from '../../../cypress/fixtures/seeds/asyncOperationsFixture.json';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { requestMiddleware } from '../../../app/src/js/middleware/request.js';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

test.beforeEach((t) => {
  // Mock useDispatch hook
  sinon.stub(redux, 'useDispatch').returns(sinon.spy());
});

test.afterEach.always(() => {
  sinon.restore();
});

const testOperation = asyncOperationsFixture.results[1]; // Use the second operation (SUCCEEDED status)
const operationId = testOperation.id;
const locationQueryParams = { search: {} };
const dispatch = () => {};
const middlewares = [requestMiddleware, thunk];
const mockStore = configureMockStore(middlewares);
const someStore = mockStore({
  getState: () => {},
  subscribe: () => {},
  timer: { running: false, seconds: -1 },
  locationQueryParams,
  dispatch
});

test('Operation Status shows operation details', function (t) {
  const operationStatus = {
    data: testOperation,
    inflight: false,
    error: false
  };

  // Mock useSelector to return operationStatus
  sinon.stub(redux, 'useSelector').returns(operationStatus);
  // Mock useParams to return operationId
  sinon.stub(router, 'useParams').returns({ operationId });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={[`/operations/operation/${operationId}`]}>
        <OperationStatus />
      </MemoryRouter>
    </Provider>
  );

  // Check that the operation ID is displayed
  const heading = screen.getByText(/Async Operation:/);
  t.truthy(heading);
  t.true(heading.textContent.includes(operationId));

  // Check that metadata is rendered
  const metadata = container.querySelector('.metadata__details');
  t.truthy(metadata);

  // Check that metadata labels are present
  const metadataLabels = container.querySelectorAll('dt');
  t.true(metadataLabels.length > 0);

  // Check that metadata values are present
  const metadataValues = container.querySelectorAll('dd');
  t.true(metadataValues.length > 0);
});

test('Operation Status shows loading state when inflight', function (t) {
  const operationStatus = {
    data: {},
    inflight: true,
    error: false
  };

  sinon.stub(redux, 'useSelector').returns(operationStatus);
  sinon.stub(router, 'useParams').returns({ operationId });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={[`/operations/operation/${operationId}`]}>
        <OperationStatus />
      </MemoryRouter>
    </Provider>
  );

  // Check that loading indicator is shown
  const loadingSection = container.querySelector('.page__section__header-wrapper');
  t.truthy(loadingSection);
});

test('Operation Status shows error when error is present', function (t) {
  const operationStatus = {
    data: {},
    inflight: false,
    error: 'Test error message'
  };

  sinon.stub(redux, 'useSelector').returns(operationStatus);
  sinon.stub(router, 'useParams').returns({ operationId });

  const { container } = render(
    <Provider store={someStore}>
      <MemoryRouter initialEntries={[`/operations/operation/${operationId}`]}>
        <OperationStatus />
      </MemoryRouter>
    </Provider>
  );

  // Check that error report is shown
  const errorSection = container.querySelector('.page__section__header-wrapper');
  t.truthy(errorSection);
});

