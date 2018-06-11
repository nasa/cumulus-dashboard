'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  interval,
  getReconciliationReport
} from '../../actions';
import { get } from 'object-path';
import { renderProgress } from '../../utils/table-config/pdr-progress';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import { updateInterval } from '../../config';

const metaAccessors = [];

var ReconciliationReport = React.createClass({
  propTypes: {
    reconciliationReports: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    router: React.PropTypes.object
  },

  componentWillMount: function () {
    const { reconciliationName } = this.props.params;
    const immediate = !this.props.reconciliationReports.map[reconciliationName];
    this.reload(immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate) {
    const { reconciliationName } = this.props.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getReconciliationReport(reconciliationName)), updateInterval, immediate);
  },

  generateQuery: function () {
    const reconciliationName = get(this.props, ['params', 'reconciliationName']);
    return { reconciliationName };
  },

  navigateBack: function () {
    this.props.router.push('/reconciliations');
  },

  renderProgress: function (record) {
    return (
      <div className='reconciliation__progress'>
        {renderProgress(get(record, 'data', {}))}
      </div>
    );
  },

  render: function () {
    const { reconciliationReportName } = this.props.params;
    const record = this.props.reconciliationReports.map[reconciliationReportName];
    const error = record.error;

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{reconciliationReportName}</h1>
            {this.renderProgress(record)}
            {error ? <ErrorReport report={error} /> : null}
          </div>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Reconciliation report</h2>
          </div>
          {!record || (record.inflight && !record.data) ? <Loading /> : <Metadata data={record.data} accessors={metaAccessors} />}
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>

          </div>
        </section>
      </div>
    );
  }
});

export default connect(state => state)(ReconciliationReport);
