'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue, fullDate } from '../format';

export const tableColumns = [
  {
    Header: 'Name',
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
    accessor: row => fullDate(row.createdAt)
  },
  {
    Header: 'Download Report'
  },
  {
    Header: 'Delete Report'
  }
];

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
