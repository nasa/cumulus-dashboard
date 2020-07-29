'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, dateOnly } from '../format';
import { getReconciliationReport, deleteReconciliationReport, listReconciliationReports } from '../../actions';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = ({ dispatch }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value } }) => <Link to={location => ({ pathname: `/reconciliation-reports/report/${value}`, search: getPersistentQueryParams(location) })}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Report Type',
    accessor: 'type'
  },
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
    Header: 'Download Report',
    id: 'download',
    accessor: 'name',
    Cell: ({ cell: { value } }) => { // eslint-disable-line react/prop-types
      return (
        <button className='button button__row button__row--download'
          onClick={e => handleDownloadClick(e, value, dispatch)}
        />
      );
    },
    disableSortBy: true
  },
  {
    Header: 'Delete Report',
    id: 'delete',
    accessor: 'name',
    Cell: ({ cell: { value } }) => ( // eslint-disable-line react/prop-types
      <button className='button button__row button__row--delete'
        onClick={e => handleDeleteClick(e, value, dispatch)}
      />
    ),
    disableSortBy: true
  }
]);

const handleDownloadClick = (e, reportName, dispatch) => {
  e.preventDefault();
  dispatch(getReconciliationReport(reportName)).then(response => {
    const { data } = response;
    const jsonHref = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement('a');
    link.setAttribute('download', `${reportName}.json`);
    link.href = jsonHref;
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  });
};

const handleDeleteClick = (e, value, dispatch) => {
  e.preventDefault();
  dispatch(deleteReconciliationReport(value)).then(() => {
    dispatch(listReconciliationReports());
  });
};

export const bulkActions = function (reports) {
  return [];
};

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
    Cell: ({ cell: { value } }) => value ? <a href={value} target='_blank'>Link</a> : nullValue // eslint-disable-line react/prop-types
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
    Cell: ({ cell: { value } }) => value ? <a href={value} target='_blank'>Link</a> : nullValue // eslint-disable-line react/prop-types
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
