'use strict';
import url from 'url';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  interval,
  getReconciliationReport
} from '../../actions';
import { nullValue } from '../../utils/format';
import SortableTable from '../table/sortable';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import { updateInterval } from '../../config';

const metaAccessors = [
  ['Created', 'reportStartTime'],
  ['Status', 'status'],
  ['OK file count', 'okFileCount']
];

const tableHeaderS3 = [
  'Filename',
  'Bucket',
  'S3 Link'
];

const tableRowS3 = [
  (d) => d.filename,
  (d) => d.bucket,
  (d) => d ? <a href={d.path} target='_blank'>Link</a> : nullValue
];

const tableHeaderDynamoDb = [
  'GranuleId',
  'Filename',
  'Bucket',
  'S3 Link'
];

const tableRowDyanmoDb = [
  (d) => d.granuleId,
  (d) => d.filename,
  (d) => d.bucket,
  (d) => d ? <a href={d.path} target='_blank'>Link</a> : nullValue
];

class ReconciliationReport extends React.Component {
  constructor () {
    super();
    this.reload = this.reload.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
  }

  componentDidMount () {
    const { reconciliationReportName } = this.props.params;
    const immediate = !this.props.reconciliationReports.map[reconciliationReportName];
    this.reload(immediate);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  reload (immediate) {
    const { reconciliationReportName } = this.props.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getReconciliationReport(reconciliationReportName)), updateInterval, immediate);
  }

  navigateBack () {
    this.props.router.push('/reconciliations');
  }

  render () {
    const { reconciliationReports } = this.props;
    const { reconciliationReportName } = this.props.params;

    const record = reconciliationReports.map[reconciliationReportName];

    let filesInS3 = [];
    let filesInDynamoDb = [];
    if (record && record.data) {
      const report = record.data;
      const { filesInCumulus } = report;

      if (filesInCumulus.onlyInDynamoDb && filesInCumulus.onlyInS3) {
        filesInS3 = filesInCumulus.onlyInS3.map(d => {
          const parsed = url.parse(d);
          return {
            filename: path.basename(parsed.pathname),
            bucket: parsed.hostname,
            path: parsed.href
          };
        });

        filesInDynamoDb = filesInCumulus.onlyInDynamoDb.map(d => {
          const parsed = url.parse(d.uri);
          return {
            granuleId: d.granuleId,
            filename: path.basename(parsed.pathname),
            bucket: parsed.hostname,
            path: parsed.href
          };
        });
      }
    }

    let error;
    if (record && record.data) {
      error = record.data.error;
    }

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

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              Files only in DynamoDB ({filesInDynamoDb.length})
            </h2>
          </div>
          <SortableTable
            data={filesInDynamoDb}
            header={tableHeaderDynamoDb}
            row={tableRowDyanmoDb}
            props={['granuleId', 'filename', 'bucket', 'link']}
          />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              Files only in S3 ({filesInS3.length})
            </h2>
          </div>
          <SortableTable
            data={filesInS3}
            header={tableHeaderS3}
            row={tableRowS3}
            props={['filename', 'bucket', 'link']}
          />
        </section>
      </div>
    );
  }
}

ReconciliationReport.propTypes = {
  reconciliationReports: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
  router: PropTypes.object
};

ReconciliationReport.defaultProps = {
  reconciliationReports: []
};

export { ReconciliationReport };
export default connect(state => state)(ReconciliationReport);
