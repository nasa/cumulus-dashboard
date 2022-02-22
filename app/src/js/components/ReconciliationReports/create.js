import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
import Tooltip from '../Tooltip/tooltip';
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
  return reconciliationReportTypes.find((recType) => recType.id === reportType)
    .description;
}

const CreateReconciliationReport = ({
  collections,
  dispatch,
  granules,
  providers,
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

  function onCancel() {
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  function onSubmit(fields = {}) {
    const { location, startTimestamp, endTimestamp, ...otherFields } = fields;
    const payload = {
      ...((location && location !== 'all') && { location }),
      ...(startTimestamp && { startTimestamp: moment(moment.utc(startTimestamp).format(dateTimeFormat)).valueOf() }),
      ...(endTimestamp && { endTimestamp: moment(moment.utc(endTimestamp).format(dateTimeFormat)).valueOf() }),
      ...otherFields
    };
    dispatch(createReconciliationReport(payload));
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  function parseDropdown(value) {
    if (!value) return;
    return value.value;
  }

  function formatDropdown(value) {
    if (!value) return;
    return {
      label: value,
      value,
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

  function renderForm({ handleSubmit, submitting, values }) {
    const { collectionId, granuleId, provider, reportType } = values || {};

    const collectionIdDisabled = reportType !== 'ORCA Backup' && (!!granuleId || !!provider);
    const granuleIdDisabled = reportType !== 'ORCA Backup' && (!!collectionId || !!provider);
    const providerDisabled = reportType !== 'ORCA Backup' && (!!collectionId || !!granuleId);

    return (
      <form onSubmit={handleSubmit} className="create-report">
        <div>
          <label htmlFor="reportType">Report Type</label>
          <div className="form__item form__item--tooltip">
            <Field
              inputId="reportType"
              className="reportType"
              name="reportType"
              component={SimpleDropdownAdapter}
              options={reportTypeOptions}
              parse={parseDropdown}
              format={formatDropdown}
            />
            {reportType && (
              <Tooltip
                className="tooltip--light"
                id="report-type-tooltip"
                placement="right"
                target={
                  <FontAwesomeIcon
                    className="button__icon--animation"
                    icon={faInfoCircle}
                  />
                }
                tip={getTooltipInfoFromType(reportType)}
              />
            )}
          </div>
        </div>
        <div className="main-form--wrapper">
          {reportType && (
            <h2 className="heading--large">{displayCase(reportType)}</h2>
          )}
          <div className="form__item">
            <label htmlFor="reportName">Report Name</label>
            <Field
              id="reportName"
              className="reportName"
              name="reportName"
              component={TextFormAdapter}
              type="text"
              placeholder="Report Name"
            />
          </div>
          <div className="form__item">
            <span className="label">Date Range</span>
            <Field
              className="startTimestamp"
              name="startTimestamp"
              component={DatePickerAdapter}
              type="date"
            />
            <span> to </span>
            <Field
              className="endTimestamp"
              name="endTimestamp"
              component={DatePickerAdapter}
              type="date"
            />
          </div>
          <div className="form__item form__item--tooltip">
            <span>Additional Filters</span>
            {reportType !== 'ORCA Backup' && (
              <Tooltip
                className="tooltip--light"
                id="report-filter-tooltip"
                placement="right"
                target={
                  <FontAwesomeIcon
                    className="button__icon--animation"
                    icon={faInfoCircle}
                  />
                }
                tip="Only one of Provider, Collection ID, or Granule ID may be applied for each report"
              />
            )}
          </div>
          <div className="form__item">
            <label htmlFor="provider">Provider</label>
            <Field
              inputId="provider"
              className="provider"
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
            <label htmlFor="collectionId">Collection ID</label>
            <Field
              inputId="collectionId"
              className="collectionId"
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
            <label htmlFor="granuleId">Granule ID</label>
            <Field
              inputId="granuleId"
              className="granuleId"
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
            <span>
              Select the areas that you would like to apply in your comparison
              results.
            </span>
            <div className="radio location">
              <label htmlFor="all">
                <Field
                  id="all"
                  name="location"
                  component="input"
                  type="radio"
                  value="all"
                />
                All <i>(default)</i>
              </label>
              <label htmlFor="S3">
                <Field
                  id="S3"
                  name="location"
                  component="input"
                  type="radio"
                  value="S3"
                />
                S3
              </label>
              <label htmlFor="CMR">
                <Field
                  id="CMR"
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
            <button
              className="button button--submit button__animation--md button__arrow button__animation button__arrow--white form-group__element--right"
              disabled={submitting}
            >
              Create New Report
            </button>
            <button
              className="button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--right"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
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
};

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    granules: state.granules,
    providers: state.providers,
  }))(CreateReconciliationReport)
);
