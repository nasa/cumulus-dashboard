import React from 'react';
import { Link } from 'react-router-dom';
import get from 'lodash/get';

import { nullValue, dateOnly, IndicatorWithTooltip, collectionHrefFromId, providerLink } from '../format';
import { getReconciliationReport, deleteReconciliationReport, listReconciliationReports } from '../../actions';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = ({ dispatch, isGranules, query }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value }, row: { original: { type } } }) => { // eslint-disable-line react/prop-types
      const link = (location) => ({ pathname: `/reconciliation-reports/report/${encodeURIComponent(value)}`, search: getPersistentQueryParams(location) });
      switch (type) {
        case 'Internal':
        case 'Granule Inventory':
          return <Link to={link} onClick={(e) => handleDownloadClick(e, value, dispatch)}>{value}</Link>;
        default:
          return <Link to={link} >{value}</Link>;
      }
    }
  }, ...(!isGranules
    ? [{
        Header: 'Report Type',
        accessor: 'type'
      }]
    : []),
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Date Generated',
    accessor: 'createdAt',
    Cell: ({ cell: { value } }) => dateOnly(value)
  },
  {
    Header: `Download ${isGranules ? 'List' : 'Report'}`,
    id: 'download',
    accessor: 'name',
    Cell: ({ cell: { value } }) => (// eslint-disable-line react/prop-types
      <button
        aria-label="Download Report"
        className='button button__row button__row--download'
        onClick={(e) => handleDownloadClick(e, value, dispatch)}
      />
    ),
    disableSortBy: true
  },
  {
    Header: `Delete ${isGranules ? 'List' : 'Report'}`,
    id: 'delete',
    accessor: 'name',
    Cell: ({ cell: { value } }) => ( // eslint-disable-line react/prop-types
      <button
        aria-label="Delete Report"
        className='button button__row button__row--delete'
        onClick={(e) => handleDeleteClick(e, value, dispatch, query)}
      />
    ),
    disableSortBy: true
  }
]);

const MAX_REPORT_RETRIES = 5;

const handleDownloadClick = (e, reportName, dispatch) => {
  e.preventDefault();
  dispatch(getReconciliationReport(reportName)).then((response) => {
    const url = get(response, 'data.presignedS3Url');
    if (url && window && !window.Cypress) window.open(url);
  });
};

const handleDeleteClick = (e, value, dispatch, query) => {
  e.preventDefault();
  dispatch(deleteReconciliationReport(value)).then((response) => {
    if (!response.error) {
      refreshReports(dispatch, value, query, MAX_REPORT_RETRIES);
    }
  });
};

// It can take an extra second or two to delete a report from
// Elasticsearch. This function keeps checking the reports to make sure it was
// deleted before displaying the delete result.
const refreshReports = (dispatch, value, query, retries) => {
  if (retries > 0) {
    dispatch(listReconciliationReports(query)).then((reports) => {
      const reportDeleted = checkReportDeleted(value, reports.data.results);
      if (!reportDeleted) {
        setTimeout(
          () => refreshReports(dispatch, value, query, retries - 1),
          1000
        );
      }
    });
  }
};

const checkReportDeleted = (reportName, reports) => reports.every((report) => report.name !== reportName);

export const bulkActions = (reports) => [];

/**
 * Commenting out Conflict Details for all the following tables
 * since it does not currently function
 */
export const tableColumnsS3Files = [
  {
    Header: 'Filename',
    accessor: 'filename'
  },
  {
    Header: 'Conflict Type',
    id: 'conflictType',
    Cell: <span className='status-indicator status-indicator--failed'></span>,
    disableSortBy: true
  },
  // {
  //   Header: 'Conflict Details',
  //   id: 'conflictDetails',
  //   Cell: 'View Details',
  //   disableSortBy: true
  // },
  {
    Header: 'Bucket',
    accessor: 'bucket'
  },
  {
    Header: 'S3 Link',
    accessor: 'path',
    Cell: ({ cell: { value } }) => (value ? <a href={value} target='_blank'>Link</a> : nullValue) // eslint-disable-line react/prop-types
  }
];

export const tableColumnsFiles = [
  {
    Header: 'GranuleId',
    accessor: 'granuleId'
  },
  {
    Header: 'Filename',
    accessor: 'filename'
  },
  {
    Header: 'Conflict Type',
    id: 'conflictType',
    Cell: <span className='status-indicator status-indicator--orange'></span>,
    disableSortBy: true
  },
  // {
  //   Header: 'Conflict Details',
  //   id: 'conflictDetails',
  //   Cell: 'View Details',
  //   disableSortBy: true
  // },
  {
    Header: 'Bucket',
    accessor: 'bucket'
  },
  {
    Header: 'S3 Link',
    accessor: 'path',
    Cell: ({ cell: { value } }) => (value ? <a href={value} target='_blank'>Link</a> : nullValue) // eslint-disable-line react/prop-types
  }
];

export const tableColumnsCollections = [
  {
    Header: 'Collection name',
    accessor: 'name',
  },
  // {
  //   Header: 'Conflict Details',
  //   id: 'conflictDetails',
  //   Cell: 'View Details',
  //   disableSortBy: true
  // }
];

export const tableColumnsGranules = [
  {
    Header: 'Granule ID',
    accessor: 'granuleId'
  },
  {
    Header: 'Collection ID',
    accessor: 'collectionId'
  },
  {
    Header: 'Conflict Type',
    id: 'conflictType',
    Cell: <span className='status-indicator status-indicator--failed'></span>,
    disableSortBy: true
  },
  // {
  //   Header: 'Conflict Details',
  //   id: 'conflictDetails',
  //   Cell: 'View Details',
  //   disableSortBy: true
  // }
];

export const tableColumnsGnf = [
  {
    Header: 'Collection ID',
    accessor: 'collectionId',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value } }) => <Link to={(location) => ({
      pathname: collectionHrefFromId(value), search: getPersistentQueryParams(location)
    })}>{value}</Link>,
    width: 125,
  },
  {
    Header: 'Granule ID',
    accessor: 'granuleId',
    width: 200,
  },
  // {
  //   Header: 'Provider',
  //   accessor: 'provider',
  // },
  {
    Header: 'S3',
    id: 's3',
    Cell: ({ row: { original: { s3 }, values: { granuleId } } }) => ( // eslint-disable-line react/prop-types
      <IndicatorWithTooltip granuleId={granuleId} repo='s3' value={s3} />
    ),
    width: 50,
  },
  // {
  //   Header: 'S3 Glacier',
  //   id: 'glacier',
  //   Cell: <span className='status-indicator status-indicator--failed'></span>,
  // },
  {
    Header: 'Cumulus',
    id: 'cumulus',
    Cell: ({ row: { original: { cumulus }, values: { granuleId } } }) => ( // eslint-disable-line react/prop-types
      <IndicatorWithTooltip granuleId={granuleId} repo='cumulus' value={cumulus} />
    ),
    width: 50,
  },
  {
    Header: 'CMR',
    id: 'cmr',
    Cell: ({ row: { original: { cmr }, values: { granuleId } } }) => ( // eslint-disable-line react/prop-types
      <IndicatorWithTooltip granuleId={granuleId} repo='cmr' value={cmr} />
    ),
    width: 50,
  },
];

export const tableColumnsBackup = ({ reportType, reportName }) => ([
  {
    Header: 'Granule ID',
    accessor: 'granuleId',
    width: 200,
  },
  {
    Header: 'Conflict Type',
    accessor: 'conflictType',
  },
  {
    Header: 'Conflict Details',
    id: 'conflictDetails',
    Cell: ({ row: { original: granule, values: { granuleId } } }) => ( // eslint-disable-line react/prop-types
    <Link
      to={{
        pathname: `/reconciliation-reports/report/${reportName}/details`,
        state: { reportType, reportName, granule }
      }} >View Details</Link>
    ),
    disableSortBy: true
  },
  {
    Header: 'Collection ID',
    accessor: 'collectionId',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value } }) => <Link to={(location) => ({
      pathname: collectionHrefFromId(value), search: getPersistentQueryParams(location)
    })}>{value}</Link>,
    width: 125,
  },
  {
    Header: 'Provider',
    accessor: 'provider',
    Cell: ({ cell: { value } }) => providerLink(value)
  }
]);

const fileLink = (bucket, key) => `https://${bucket}.s3.amazonaws.com/${key}`;
export const tableColumnsGranuleConflictDetails = ({ reportType }) => {
  const checkButton = <button className='button button__row button__row--check'/>;
  const orcaBackupColumns = [
    {
      Header: 'In Orca Only',
      id: 'onlyInOrca',
      accessor: 'reason',
      Cell: ({ cell: { value } }) => (
        (value === 'onlyInOrca') ? checkButton : nullValue
      ),
      disableSortBy: true,
    },
    {
      Header: 'Should Be Excluded From Orca',
      id: 'shouldBeExcludedFromOrca',
      accessor: 'reason',
      Cell: ({ cell: { value } }) => (
        (value === 'shouldBeExcludedFromOrca') ? checkButton : nullValue
      ),
      disableSortBy: true,
    },
  ];
  const backupColumns = (reportType === 'ORCA Backup') ? orcaBackupColumns : [];

  return [
    {
      Header: 'Filename',
      accessor: 'fileName',
      width: 200,
    },
    {
      Header: 'Link',
      accessor: (row) => (row.bucket && row.key
        ? (<a href={fileLink(row.bucket, row.key)}>
            {row.fileName ? 'Link' : nullValue}
          </a>)
        : null),
      id: 'link',
    },
    {
      Header: 'In Cumulus Only',
      id: 'onlyInCumulus',
      accessor: 'reason',
      Cell: ({ cell: { value } }) => (
        (value === 'onlyInCumulus') ? checkButton : nullValue
      ),
      disableSortBy: true,
    }
  ].concat(
    backupColumns,
    {
      Header: 'Bucket',
      accessor: 'bucket',
    }
  );
};
