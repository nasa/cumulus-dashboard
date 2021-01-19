import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, dateOnly, collectionNameVersion, IndicatorWithTooltip } from '../format';
import { getReconciliationReport, deleteReconciliationReport, listReconciliationReports } from '../../actions';
import { getPersistentQueryParams } from '../url-helper';
import { downloadFile } from '../download-file';

export const tableColumns = ({ dispatch, isGranules, query }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value }, row: { original: { type } } }) => { // eslint-disable-line react/prop-types
      const link = (location) => ({ pathname: `/reconciliation-reports/report/${value}`, search: getPersistentQueryParams(location) });
      switch (type) {
        case 'Internal':
          return <Link to={link} onClick={(e) => handleDownloadClick(e, value, dispatch)}>{value}</Link>;
        case 'Granule Inventory':
          return <Link to={link} onClick={(e) => handleCsvDownloadClick(e, value, dispatch)}>{value}</Link>;
        default:
          return <Link to={link} >{value}</Link>;
      }
    }
  }, ...(!isGranules ? [{
    Header: 'Report Type',
    accessor: 'type'
  }] : []),
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
        onClick={(e) => (isGranules
          ? handleCsvDownloadClick(e, value, dispatch)
          : handleDownloadClick(e, value, dispatch))}
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

const handleDownloadClick = (e, reportName, dispatch) => {
  e.preventDefault();
  dispatch(getReconciliationReport(reportName)).then((response) => {
    const { data } = response;
    const url = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    downloadFile(url, `${reportName}.json`);
  });
};

const handleCsvDownloadClick = (e, reportName, dispatch) => {
  e.preventDefault();
  dispatch(getReconciliationReport(reportName)).then((response) => {
    const { data } = response;
    const { url } = data;
    if (url && window && !window.Cypress) window.open(url);
  });
};

const handleDeleteClick = (e, value, dispatch, query) => {
  e.preventDefault();
  dispatch(deleteReconciliationReport(value)).then((response) => {
    dispatch(listReconciliationReports(query));
  });
};

export const bulkActions = (reports) => [];

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
  {
    Header: 'Conflict Details',
    id: 'conflictDetails',
    Cell: 'View Details',
    disableSortBy: true
  },
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
  {
    Header: 'Conflict Details',
    id: 'conflictDetails',
    Cell: 'View Details',
    disableSortBy: true
  },
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
  {
    Header: 'Conflict Details',
    id: 'conflictDetails',
    Cell: 'View Details',
    disableSortBy: true
  }
];

export const tableColumnsGranules = [
  {
    Header: 'Granule ID',
    accessor: 'granuleId'
  },
  {
    Header: 'Conflict Type',
    id: 'conflictType',
    Cell: <span className='status-indicator status-indicator--failed'></span>,
    disableSortBy: true
  },
  {
    Header: 'Conflict Details',
    id: 'conflictDetails',
    Cell: 'View Details',
    disableSortBy: true
  }
];

export const tableColumnsGnf = [
  {
    Header: 'Collection ID',
    accessor: 'collectionId',
    Cell: ({ cell: { value } }) => { // eslint-disable-line react/prop-types
      const { name, version } = collectionNameVersion(value);
      return <Link to={(location) => ({ pathname: `/collections/collection/${name}/${version}`, search: getPersistentQueryParams(location) })}>{value}</Link>;
    },
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
