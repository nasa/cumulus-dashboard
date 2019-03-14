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
import {
  tableHeaderS3Files,
  tableRowS3File,
  tableHeaderGranuleFiles,
  tableRowGranuleFile,
  tablePropsGranuleFile,
  tableHeaderCollections,
  tableRowCollection,
  tablePropsCollection,
  tableHeaderGranules,
  tableRowGranule,
  tablePropsGranule
} from '../../utils/table-config/reconciliation-reports';
import SortableTable from '../table/sortable';
import Metadata from '../table/metadata';
import Loading from '../app/loading-indicator';
import ErrorReport from '../errors/report';
import { updateInterval } from '../../config';

import ReportTable from './report-table';

const reportMetaAccessors = [
  ['Created', 'reportStartTime'],
  ['Status', 'status']
];

const fileMetaAccessors = [
  ['OK file count', 'okCount']
];

const collectionMetaAccessors = [
  ['OK collection count', 'okCount']
];

const granuleMetaAccessors = [
  ['OK granule count', 'okCount']
];

const parseFileObject = (d) => {
  const parsed = url.parse(d.uri);
  return {
    granuleId: d.granuleId,
    filename: path.basename(parsed.pathname),
    bucket: parsed.hostname,
    path: parsed.href
  };
};

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

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }

    let filesInS3 = [];
    let filesInDynamoDb = [];

    let filesOnlyInCumulus = [];
    let filesOnlyInCmr = [];

    let collectionsInCumulus = [];
    let collectionsInCmr = [];

    let granulesInCumulus = [];
    let granulesInCmr = [];

    let filesInCumulus;
    let filesInCumulusCmr;
    let collectionsInCumulusCmr;
    let granulesInCumulusCmr;

    if (record && record.data) {
      const report = record.data;
      ({
        filesInCumulus,
        filesInCumulusCmr,
        collectionsInCumulusCmr,
        granulesInCumulusCmr
      } = report);

      if (filesInCumulus.onlyInDynamoDb && filesInCumulus.onlyInS3) {
        filesInS3 = filesInCumulus.onlyInS3.map(d => {
          const parsed = url.parse(d);
          return {
            filename: path.basename(parsed.pathname),
            bucket: parsed.hostname,
            path: parsed.href
          };
        });

        filesInDynamoDb = filesInCumulus.onlyInDynamoDb.map(parseFileObject);
      }

      if (filesInCumulusCmr.onlyInCumulus && filesInCumulusCmr.onlyInCmr) {
        filesOnlyInCumulus = filesInCumulusCmr.onlyInCumulus.map(parseFileObject);

        filesOnlyInCmr = filesInCumulusCmr.onlyInCmr.map(d => {
          const parsed = url.parse(d.URL);
          const bucket = parsed.hostname.split('.')[0];
          return {
            granuleId: d.GranuleUR,
            filename: path.basename(parsed.pathname),
            bucket,
            path: `s3://${bucket}${parsed.pathname}`
          };
        });
      }

      if (collectionsInCumulusCmr.onlyInCumulus && collectionsInCumulusCmr.onlyInCmr) {
        const getCollectionName = (collectionName) => ({ name: collectionName });
        collectionsInCumulus = collectionsInCumulusCmr.onlyInCumulus.map(getCollectionName);
        collectionsInCmr = collectionsInCumulusCmr.onlyInCmr.map(getCollectionName);
      }

      if (granulesInCumulusCmr.onlyInCumulus && granulesInCumulusCmr.onlyInCmr) {
        granulesInCumulus = granulesInCumulusCmr.onlyInCumulus;
        granulesInCmr = granulesInCumulusCmr.onlyInCmr
          .map((granule) => ({ granuleId: granule.GranuleUR }));
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
          <Metadata data={record.data} accessors={reportMetaAccessors} />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              DynamoDB vs S3
            </h2>
          </div>

          <div className='page__section--small'>
            <Metadata data={filesInCumulus} accessors={fileMetaAccessors} />
          </div>

          <ReportTable
            data={filesInDynamoDb}
            title={'Files only in DynamoDB'}
            tableHeader={tableHeaderGranuleFiles}
            tableRow={tableRowGranuleFile}
            tableProps={tablePropsGranuleFile}
          />

          <ReportTable
            data={filesInS3}
            title={'Files only in S3'}
            tableHeader={tableHeaderS3Files}
            tableRow={tableRowS3File}
            tableProps={['filename', 'bucket', 'link']}
          />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              Cumulus vs CMR
            </h2>
          </div>

          <div className='page__section--small'>
            <Metadata data={filesInCumulusCmr} accessors={fileMetaAccessors} />
          </div>

          <ReportTable
            data={filesOnlyInCumulus}
            title={'Files only in Cumulus'}
            tableHeader={tableHeaderGranuleFiles}
            tableRow={tableRowGranuleFile}
            tableProps={tablePropsGranuleFile}
          />

          <ReportTable
            data={filesOnlyInCmr}
            title={'Files only in CMR'}
            tableHeader={tableHeaderGranuleFiles}
            tableRow={tableRowGranuleFile}
            tableProps={tablePropsGranuleFile}
          />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              Collections
            </h2>
          </div>

          <div className='page__section--small'>
            <Metadata data={collectionsInCumulusCmr} accessors={collectionMetaAccessors} />
          </div>

          <ReportTable
            data={collectionsInCumulus}
            title={'Collections only in Cumulus'}
            tableHeader={tableHeaderCollections}
            tableRow={tableRowCollection}
            tableProps={tablePropsCollection}
          />

          <ReportTable
            data={collectionsInCmr}
            title={'Collections only in CMR'}
            tableHeader={tableHeaderCollections}
            tableRow={tableRowCollection}
            tableProps={tablePropsCollection}
          />
        </section>

        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>
              Granules
            </h2>
          </div>

          <div className='page__section--small'>
            <Metadata data={granulesInCumulusCmr} accessors={granuleMetaAccessors} />
          </div>

          <ReportTable
            data={granulesInCumulus}
            title={'Granules only in Cumulus'}
            tableHeader={tableHeaderGranules}
            tableRow={tableRowGranule}
            tableProps={tablePropsGranule}
          />

          <ReportTable
            data={granulesInCmr}
            title={'Granules only in CMR'}
            tableHeader={tableHeaderGranules}
            tableRow={tableRowGranule}
            tableProps={tablePropsGranule}
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
