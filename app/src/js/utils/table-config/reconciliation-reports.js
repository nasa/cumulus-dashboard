'use strict';
import React from 'react';
import { Link } from 'react-router-dom';

import { nullValue } from '../format';

export const tableColumns = [
  {
    Header: 'Report filename',
    accessor: row => <Link to={`/reconciliation-reports/report/${row.reconciliationReportName}`}>{row.reconciliationReportName}</Link>
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

