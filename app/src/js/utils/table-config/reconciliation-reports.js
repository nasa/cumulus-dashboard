'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, dateOnly } from '../format';
import { deleteReconciliationReport, listReconciliationReports } from '../../actions';

export const tableColumns = ({ dispatch }) => ([
  {
    Header: 'Name',
    id: 'name',
    accessor: row => <Link to={`/reconciliation-reports/report/${row.name}`}>{row.name}</Link>
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
    id: 'createdAt',
    accessor: row => dateOnly(row.createdAt)
  },
  {
    Header: 'Download Report'
  },
  {
    Header: 'Delete Report',
    id: 'delete',
    accessor: 'name',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value } }) => (
      <button className='button button__row button__row--delete'
        onClick={e => handleDeleteClick(e, value, dispatch)}
      />
    )
  }
]);

const handleDeleteClick = (e, value, dispatch) => {
  e.preventDefault();
  dispatch(deleteReconciliationReport(value))
    .then(() => dispatch(listReconciliationReports()));
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
    Header: 'Bucket',
    accessor: 'bucket'
  },
  {
    Header: 'S3 Link',
    accessor: row => row ? <a href={row.path} target='_blank'>Link</a> : nullValue,
    id: 'path'
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
    Header: 'Bucket',
    accessor: 'bucket'
  },
  {
    Header: 'S3 Link',
    accessor: row => row ? <a href={row.path} target='_blank'>Link</a> : nullValue,
    id: 'path'
  }
];

export const tableColumnsCollections = [
  {
    Header: 'Collection name',
    accessor: 'name'
  }
];

export const tableColumnsGranules = [
  {
    Header: 'Granule ID',
    accessor: 'granuleId'
  }
];
