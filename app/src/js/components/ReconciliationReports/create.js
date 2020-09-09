import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createNextState } from '@reduxjs/toolkit';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { createReconciliationReport } from '../../actions';
import SimpleDropdown from '../DropDown/simple-dropdown';
import TextForm from '../TextAreaForm/text';
import { historyPushWithQueryParams } from '../../utils/url-helper';
import { reconciliationReportTypes } from '../../utils/type';

const reportTypeOptions = reconciliationReportTypes
  .map((recType) => ({ value: recType.id, label: recType.label }));

const baseRoute = '/reconciliation-reports';
const defaultReportType = 'Inventory';

class CreateReconciliationReport extends React.Component {
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      inputs: {
        reportType: defaultReportType,
      },
    };

    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
  }

  handleDropdownChange(id, optionValue, option) {
    console.log(id, option);
    this.setState(createNextState((state) => {
      state.inputs[id] = option.value;
    }));
  }

  handleTextInputChange(id, value) {
    this.setState(createNextState((state) => {
      state.inputs[id] = value;
    }));
  }

  onCancel(e) {
    e.preventDefault();
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  onSubmit(e) {
    e.preventDefault();
    console.log('payload', this.state.inputs);
    this.props.dispatch(createReconciliationReport(this.state.inputs));
    historyPushWithQueryParams(`/${baseRoute.split('/')[1]}`);
  }

  isInflight() {
    return this.props.reconciliationReports.createReportInflight;
  }

  render() {
    const { reportType } = this.state.inputs;
    const tooltipInfo = reconciliationReportTypes
      .filter((recType) => recType.id === reportType).pop().description;

    const form = (
      <div>
        <ul>
          <li>
            <TextForm
              // className=
              label={'Report Name'}
              id={'reportName'}
              value={this.state.inputs.reportName || ''}
              onChange={this.handleTextInputChange}
              // error
              type={'text'}
            />
          </li>
          <li>
            <SimpleDropdown
              label={'Report Type'}
              id={'reportType'}
              value={reportType}
              onChange={this.handleDropdownChange}
              options={reportTypeOptions}
            />
            <OverlayTrigger
              placement={'bottom'}
              overlay={(
                <Tooltip
                  id={reportType}
                  className={'tooltip'}
                >
                  {tooltipInfo}
                </Tooltip>
              )}
            >
              <FontAwesomeIcon className='button__icon--animation' icon='info-circle' />
            </OverlayTrigger>
          </li>
        </ul>

        <button
          className={`button button__animation--md button__arrow button__arrow--md button__animation button__arrow--white button--submit${this.isInflight() ? ' button--disabled' : ''}`}
          onClick={this.onSubmit}
        >
          Create
        </button>

        <button
          className={`button button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button--cancel${this.isInflight() ? ' button--disabled' : ''}`}
          onClick={this.onCancel}
        >
          Cancel
        </button>

      </div>
    );
    return (
      <div className="create_report">
        <Helmet>
          <title> Create Report </title>
        </Helmet>
        <div className="page__component page__content--shortened--centered">
          <section className="page__section page__section--fullpage-form">
            <div className="page__section__header">
              <h1 className="heading--large">Create Report</h1>
            </div>
            <form
              className='page__section--fullpage-form page__section--fullpage-form--internal'
              id={'form-create-reconcilation-report'}
            >
              {form}
            </form>
          </section>
        </div>
      </div>
    );
  }
}

CreateReconciliationReport.propTypes = {
  dispatch: PropTypes.func,
  reconciliationReports: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    reconciliationReports: state.reconciliationReports
  }))(CreateReconciliationReport)
);
