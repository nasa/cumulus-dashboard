import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, dateOnly, collectionNameVersion } from '../format';
import { getReconciliationReport, deleteReconciliationReport, listReconciliationReports } from '../../actions';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = ({ dispatch }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value }, row: { original: { type } } }) => { // eslint-disable-line react/prop-types
      const link = (location) => ({ pathname: `/reconciliation-reports/report/${value}`, search: getPersistentQueryParams(location) });
      return (type !== 'Internal')
        ? <Link to={link} >{value}</Link>
        : <Link to={link} onClick={(e) => handleDownloadClick(e, value, dispatch)}>{value}</Link>;
    }
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
    Cell: ({ cell: { value } }) => (// eslint-disable-line react/prop-types
      <button className='button button__row button__row--download'
        onClick={(e) => handleDownloadClick(e, value, dispatch)}
      />
    ),
    disableSortBy: true
  },
  {
    Header: 'Delete Report',
    id: 'delete',
    accessor: 'name',
    Cell: ({ cell: { value } }) => ( // eslint-disable-line react/prop-types
      <button className='button button__row button__row--delete'
        onClick={(e) => handleDeleteClick(e, value, dispatch)}
      />
    ),
    disableSortBy: true
  }
]);

const handleDownloadClick = (e, reportName, dispatch) => {
  e.preventDefault();
  dispatch(getReconciliationReport(reportName)).then((response) => {
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

const getIndicatorColor = (prop) => {
  let indicatorColor = '';
  switch (prop) {
    case 'missing':
      indicatorColor = 'orange';
      break;
    case 'notFound':
      indicatorColor = 'failed';
      break;
    case false:
      indicatorColor = 'failed';
      break;
    default:
      indicatorColor = 'success';
      break;
  }
  return indicatorColor;
};

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
    Cell: ({ row: { original: { s3 } } }) => ( // eslint-disable-line react/prop-types
      <span className={`status-indicator status-indicator--${getIndicatorColor(s3)}`}></span>
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
    id: 'Cumulus',
    Cell: ({ row: { original: { cumulus } } }) => ( // eslint-disable-line react/prop-types
      <span className={`status-indicator status-indicator--${getIndicatorColor(cumulus)}`}></span>
    ),
    width: 50,
  },
  {
    Header: 'CMR',
    id: 'cmr',
    Cell: ({ row: { original: { cmr } } }) => ( // eslint-disable-line react/prop-types
      <span className={`status-indicator status-indicator--${getIndicatorColor(cmr)}`}></span>
    ),
    width: 50,
  },
];
