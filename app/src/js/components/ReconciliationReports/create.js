import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  createReconciliationReport,
  listCollections,
  listProviders,
  listGranules,
} from '../../actions';
import { historyPushWithQueryParams } from '../../utils/url-helper';
import { reconciliationReportTypes } from '../../utils/type';
import { dateTimeFormat } from '../../utils/datepicker';
import SimpleDropdown from '../DropDown/simple-dropdown';
import Datepicker from '../Datepicker/Datepicker';
import TextForm from '../TextAreaForm/text';
import { displayCase, getCollectionId } from '../../utils/format';

const baseRoute = '/reconciliation-reports';
const defaultReportType = 'Inventory';
const reportTypeOptions = reconciliationReportTypes.map((recType) => ({
  value: recType.id,
  label: recType.label,
}));

// eslint-disable-next-line react/prop-types
const SimpleDropdownAdapter = ({ input, ...rest }) => (
  <SimpleDropdown
    {...input}
    {...rest}
    // eslint-disable-next-line react/prop-types
    onChange={(id, value, option) => input.onChange(option || value)}
  />
);

// eslint-disable-next-line react/prop-types
const DatePickerAdapter = ({ input, ...rest }) => (
  <Datepicker
    {...input}
    {...rest}
    // eslint-disable-next-line react/prop-types
    onChange={(id, value) => input.onChange(value)}
  />
);

// eslint-disable-next-line react/prop-types
const TextFormAdapter = ({ input, ...rest }) => (
  <TextForm
    {...input}
    {...rest}
    // eslint-disable-next-line react/prop-types
    onChange={(id, value) => input.onChange(value)}
  />
);

function getTooltipInfoFromType(reportType) {
  return reconciliationReportTypes.find(
    (recType) => recType.id === reportType
  ).description;
}

const CreateReconciliationReport = ({
  collections,
  dispatch,
  granules,
  providers,
  reconciliationReports,
}) => {
  const {
    list: { data: collectionData },
  } = collections;
  const {
    list: { data: granuleData },
  } = granules;
  const {
    list: { data: providerData },
  } = providers;

  const collectionOptions = collectionData.map(getCollectionId);
  const granuleOptions = granuleData.map((granule) => granule.granuleId);
  const providerOptions = providerData.map((provider) => provider.id);

  useEffect(() => {
    dispatch(listCollections({ listAll: true, getMMT: false }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProviders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listGranules());
  }, [dispatch]);

  // function onCancel() {
  //   historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  // }

  function onSubmit(fields = {}) {
    const { location, ...otherFields } = fields;
    let payload = { ...otherFields };
    if (location !== 'all') {
      payload = {
        ...payload,
        location
      };
    }
    dispatch(createReconciliationReport(payload));
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  function parseDate(value) {
    return isNil(value)
      ? null
      : moment(moment.utc(value).format(dateTimeFormat)).valueOf();
  }

  function formatDate(value) {
    return isNil(value)
      ? null
      : moment(moment.utc(value).format(dateTimeFormat)).toDate();
  }

  function parseDropdown(value) {
    if (!value) return;
    return value.value;
  }

  function formatDropdown(value) {
    if (!value) return;
    return {
      label: value,
      value
    };
  }

  function parseMultiDropdown(arrayValue) {
    if (!arrayValue || arrayValue.length < 1) return;
    return arrayValue.map((v) => v.value);
  }

  function formatMultiDropdown(arrayValue) {
    if (!arrayValue) return;
    return arrayValue.map((v) => ({
      label: v,
      value: v,
    }));
  }

  // function isInflight() {
  //   return reconciliationReports.createReportInflight;
  // }

  // eslint-disable-next-line react/prop-types
  function renderForm({ handleSubmit, form, submitting, values }) {
    const { collectionId, granuleId, provider, reportType } = values || {};

    const collectionIdDisabled = !!granuleId || !!provider;
    const granuleIdDisabled = !!collectionId || !!provider;
    const providerDisabled = !!collectionId || !!granuleId;

    return (
      <form onSubmit={handleSubmit} className="create-report">
        <div>
          <label>Report Type</label>
          <div className="form__item form__item--tooltip">
            <Field
              name="reportType"
              component={SimpleDropdownAdapter}
              options={reportTypeOptions}
              parse={parseDropdown}
              format={formatDropdown}
            />
            {reportType && (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip className="tooltip">
                    {getTooltipInfoFromType(reportType)}
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  className="button__icon--animation"
                  icon="info-circle"
                />
              </OverlayTrigger>
            )}
          </div>
        </div>
        <div className="main-form--wrapper">
          {reportType && (
            <h2 className="heading--large">{displayCase(reportType)}</h2>
          )}
          <div className="form__item">
            <label>Report Name</label>
            <Field
              name="reportName"
              component={TextFormAdapter}
              type="text"
              placeholder="Report Name"
            />
          </div>
          <div className="form__item">
            <label>Date Range</label>
            <Field
              name="startTimestamp"
              component={DatePickerAdapter}
              type="date"
              parse={parseDate}
              format={formatDate}
            />
            <span>to</span>
            <Field
              name="endTimestamp"
              component={DatePickerAdapter}
              type="date"
              parse={parseDate}
              format={formatDate}
            />
          </div>
          <div className="form__item form__item--tooltip">
            <span>Additional Filters</span>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip className="tooltip">
                  You can only apply Provider OR Granule ID OR Collection ID
                </Tooltip>
              }
            >
              <FontAwesomeIcon
                className="button__icon--animation"
                icon="info-circle"
              />
            </OverlayTrigger>
          </div>
          <div className="form__item">
            <label>Provider</label>
            <Field
              name="provider"
              component={SimpleDropdownAdapter}
              placeholder="Provider"
              isDisabled={providerDisabled}
              isMulti={true}
              options={providerOptions}
              format={formatMultiDropdown}
              parse={parseMultiDropdown}
            />
          </div>
          <div className="form__item">
            <label>Collection ID</label>
            <Field
              name="collectionId"
              component={SimpleDropdownAdapter}
              placeholder="Collection ID"
              isDisabled={collectionIdDisabled}
              isMulti={true}
              options={collectionOptions}
              format={formatMultiDropdown}
              parse={parseMultiDropdown}
            />
          </div>
          <div className="form__item">
            <label>Granule ID</label>
            <Field
              name="granuleId"
              component={SimpleDropdownAdapter}
              placeholder="Granule ID"
              isDisabled={granuleIdDisabled}
              isMulti={true}
              options={granuleOptions}
              format={formatMultiDropdown}
              parse={parseMultiDropdown}
            />
          </div>

          <div className="form__item">
            <span className="description">
              Select the areas that you would like to apply in your comparison
              results.
            </span>
            <div className="multi-checkbox">
              <label>
                <Field
                  name="location"
                  component="input"
                  type="radio"
                  value="all"
                />
                All <i>(default)</i>
              </label>
              <label>
                <Field
                  name="location"
                  component="input"
                  type="radio"
                  value="S3"
                />
                S3
              </label>
              <label>
                <Field
                  name="location"
                  component="input"
                  type="radio"
                  value="CMR"
                />
                CMR
              </label>
            </div>
          </div>
          <div className="buttons">
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button
              type="button"
              // eslint-disable-next-line react/prop-types
              onClick={form.reset}
              disabled={submitting}
            >
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </form>
    );
  }

  return (
    <div className="create_report">
      <Helmet>
        <title> Create Report </title>
      </Helmet>
      <div className="page__component page__content--shortened--centered">
        <section className="page__section page__section--fullpage-form">
          <div className="page__section__header">
            <div className="heading__wrapper--border">
              <h1 className="heading--large">Create Report</h1>
            </div>
          </div>
          <Form
            onSubmit={onSubmit}
            render={renderForm}
            initialValues={{
              reportType: defaultReportType,
              location: 'all',
            }}
          />
        </section>
      </div>
    </div>
  );
};

CreateReconciliationReport.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  granules: PropTypes.object,
  providers: PropTypes.object,
  reconciliationReports: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    granules: state.granules,
    providers: state.providers,
    reconciliationReports: state.reconciliationReports,
  }))(CreateReconciliationReport)
);
