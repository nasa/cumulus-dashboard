'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, dateOnly } from '../format';
import { deleteReconciliationReport } from '../../actions';

export const tableColumns = ({ dispatch }) => ([
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ cell: { value } }) => <Link to={`/reconciliation-reports/report/${value}`}>{value}</Link> // eslint-disable-line react/prop-types
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
    Header: 'Delete Report',
    id: 'delete',
    accessor: 'name',
    // eslint-disable-next-line react/prop-types
    Cell: ({ cell: { value } }) => (
      <button onClick={() => dispatch(deleteReconciliationReport(value))}
        className='button button__row button__row--delete'>
      </button>
    )
  }
]);

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
    accessor: 'name'
  }
];

export const tableColumnsGranules = [
  {
    Header: 'Granule ID',
    accessor: 'granuleId'
  }
];
