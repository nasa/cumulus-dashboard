'use strict';
/* eslint node/no-deprecated-api: 0 */
import url from 'url';
import path from 'path';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  interval,
  getReconciliationReport
} from '../../actions';
import _config from '../../config';
import {
  tableColumnsS3Files,
  tableColumnsFiles,
  tableColumnsCollections,
  tableColumnsGranules
} from '../../utils/table-config/reconciliation-reports';

import Loading from '../LoadingIndicator/loading-indicator';
import ErrorReport from '../Errors/report';

import TableCards from './table-cards';
import SortableTable from '../SortableTable/SortableTable';

const { updateInterval } = _config;

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
    this.handleCardClick = this.handleCardClick.bind(this);
    this.state = {
      active: 0
    };
  }

  componentDidMount () {
    const { reconciliationReportName } = this.props.match.params;
    const immediate = !this.props.reconciliationReports.map[reconciliationReportName];
    this.reload(immediate);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  reload (immediate) {
    const { reconciliationReportName } = this.props.match.params;
    const { dispatch } = this.props;
    if (this.cancelInterval) { this.cancelInterval(); }
    this.cancelInterval = interval(() => dispatch(getReconciliationReport(reconciliationReportName)), updateInterval, immediate);
  }

  navigateBack () {
    this.props.history.push('/reconciliations');
  }

  getFilesSummary ({
    onlyInDynamoDb = [],
    onlyInS3 = []
  }) {
    const filesInS3 = onlyInS3.map(d => {
      const parsed = url.parse(d);
      return {
        filename: path.basename(parsed.pathname),
        bucket: parsed.hostname,
        path: parsed.href
      };
    });

    const filesInDynamoDb = onlyInDynamoDb.map(parseFileObject);

    return { filesInS3, filesInDynamoDb };
  }

  getCollectionsSummary ({
    onlyInCumulus = [],
    onlyInCmr = []
  }) {
    const getCollectionName = (collectionName) => ({ name: collectionName });
    const collectionsInCumulus = onlyInCumulus.map(getCollectionName);
    const collectionsInCmr = onlyInCmr.map(getCollectionName);
    return { collectionsInCumulus, collectionsInCmr };
  }

  getGranulesSummary ({
    onlyInCumulus = [],
    onlyInCmr = []
  }) {
    const granulesInCumulus = onlyInCumulus;
    const granulesInCmr = onlyInCmr.map((granule) => ({ granuleId: granule.GranuleUR }));
    return { granulesInCumulus, granulesInCmr };
  }

  getGranuleFilesSummary ({
    onlyInCumulus = [],
    onlyInCmr = []
  }) {
    const granuleFilesOnlyInCumulus = onlyInCumulus.map(parseFileObject);

    const granuleFilesOnlyInCmr = onlyInCmr.map(d => {
      const parsed = url.parse(d.URL);
      const bucket = parsed.hostname.split('.')[0];
      return {
        granuleId: d.GranuleUR,
        filename: path.basename(parsed.pathname),
        bucket,
        path: `s3://${bucket}${parsed.pathname}`
      };
    });

    return { granuleFilesOnlyInCumulus, granuleFilesOnlyInCmr };
  }

  handleCardClick (e, index) {
    e.preventDefault();
    this.setState({ active: index });
  }

  render () {
    const { reconciliationReports } = this.props;
    const { reconciliationReportName } = this.props.match.params;
    const { active } = this.state;

    const record = reconciliationReports.map[reconciliationReportName];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }

    let filesInS3 = [];
    let filesInDynamoDb = [];

    let granuleFilesOnlyInCumulus = [];
    let granuleFilesOnlyInCmr = [];

    let collectionsInCumulus = [];
    let collectionsInCmr = [];

    let granulesInCumulus = [];
    let granulesInCmr = [];

    let report;
    let error;

    if (record.data) {
      report = record.data;

      const {
        filesInCumulus = {},
        filesInCumulusCmr = {},
        collectionsInCumulusCmr = {},
        granulesInCumulusCmr = {}
      } = report;

      ({
        filesInS3,
        filesInDynamoDb
      } = this.getFilesSummary(filesInCumulus));

      ({
        collectionsInCumulus,
        collectionsInCmr
      } = this.getCollectionsSummary(collectionsInCumulusCmr));

      ({
        granulesInCumulus,
        granulesInCmr
      } = this.getGranulesSummary(granulesInCumulusCmr));

      ({
        granuleFilesOnlyInCumulus,
        granuleFilesOnlyInCmr
      } = this.getGranuleFilesSummary(filesInCumulusCmr));

      error = record.data.error;
    }

    const cardConfig = [
      {
        id: 'dynamo',
        name: 'DynamoDB',
        data: filesInDynamoDb,
        columns: tableColumnsFiles,
      },
      {
        id: 's3',
        name: 'S3',
        data: filesInS3,
        columns: tableColumnsS3Files
      },
      {
        id: 'cumulusCollections',
        name: 'Cumulus Collections',
        data: collectionsInCumulus,
        columns: tableColumnsCollections
      },
      {
        id: 'cmrCollections',
        name: 'CMR Collections',
        data: collectionsInCmr,
        columns: tableColumnsCollections
      },
      {
        id: 'cumulusGranules',
        name: 'Cumlus Granules',
        data: granulesInCumulus,
        columns: tableColumnsGranules
      },
      {
        id: 'cmrGranules',
        name: 'CMR Granules',
        data: granulesInCmr,
        columns: tableColumnsGranules
      },
      {
        id: 'cumulusGranules',
        name: 'Cumlus Only Granules',
        data: granuleFilesOnlyInCumulus,
        columns: tableColumnsFiles
      },
      {
        id: 'cmrGranules',
        name: 'CMR Only Granules',
        data: granuleFilesOnlyInCmr,
        columns: tableColumnsFiles
      }
    ];

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{reconciliationReportName}</h1>
            {error ? <ErrorReport report={error} /> : null}
          </div>
        </section>

        <section className='page__section page__section--small'>
          <TableCards config={cardConfig} onClick={this.handleCardClick} activeCard={active} />
        </section>

        <section className='page__section'>

          <SortableTable
            data={cardConfig[active].data}
            tableColumns={cardConfig[active].columns}
            shouldUsePagination={true}
          />
        </section>
      </div>
    );
  }
}

ReconciliationReport.propTypes = {
  reconciliationReports: PropTypes.object,
  dispatch: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object
};

ReconciliationReport.defaultProps = {
  reconciliationReports: []
};

export { ReconciliationReport };
export default withRouter(connect(state => state)(ReconciliationReport));
