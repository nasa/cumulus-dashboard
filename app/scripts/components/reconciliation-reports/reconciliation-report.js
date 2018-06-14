'use strict';
import React from 'react';
import { connect } from 'react-redux';
import {
  interval,
  getReconciliationReport
} from '../../actions';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import { updateInterval } from '../../config';

function joinArray (arr) {
  if (!arr || !arr.length) return '';
  return arr.join(', ');
}

function joinArrayObjectProperty (property) {
  return function (arr) {
    if (!arr || !arr.length) return '';
    return arr.map((obj) => obj[property]).join(', ');
  };
}

const metaAccessors = [
  ['Created', 'reportStartTime'],
  ['Status', 'status'],
  ['OK file count', 'okFileCount'],
  ['Only in S3', 'onlyInS3', joinArray],
  ['Only in DynamoDB', 'onlyInDynamoDb', joinArrayObjectProperty('granuleId')]
];

var ReconciliationReport = React.createClass({
  propTypes: {
    reconciliationReports: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    router: React.PropTypes.object
  },

  componentWillMount: function () {
    const { reconciliationReportName } = this.props.params;
    const immediate = !this.props.reconciliationReports.map[reconciliationReportName];
    this.reload(immediate);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  reload: function (immediate) {
    const { reconciliationReportName } = this.props.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getReconciliationReport(reconciliationReportName)), updateInterval, immediate);
  },

  navigateBack: function () {
    this.props.router.push('/reconciliations');
  },

  render: function () {
    const { reconciliationReportName } = this.props.params;
    const record = this.props.reconciliationReports.map[reconciliationReportName];
    const error = record.data.error;

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{reconciliationReportName}</h1>
            {error ? <ErrorReport report={error} /> : null}
          </div>
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Reconciliation report</h2>
          </div>
          {!record || (record.inflight && !record.data) ? <Loading /> : <Metadata data={record.data} accessors={metaAccessors} />}
        </section>
      </div>
    );
  }
});

export { ReconciliationReport };
export default connect(state => state)(ReconciliationReport);
