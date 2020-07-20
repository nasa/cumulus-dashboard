import React from 'react';
import { Link } from 'react-router-dom';
import {
  displayCase,
  fromNow,
  seconds,
  truncate,
  formatCollectionId
} from '../../utils/format';
import { strings } from '../../components/locale';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row: { original: { arn, name } } }) => // eslint-disable-line react/prop-types
      <Link to={location => ({ pathname: '/executions/execution/' + arn, search: getPersistentQueryParams(location) })} title={name}>{truncate(name, 24)}</Link>
  },
  {
    Header: 'Status',
    accessor: row => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Created',
    accessor: row => fromNow(row.createdAt),
    id: 'createdAt'
  },
  {
    Header: 'Duration',
    accessor: row => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: strings.collection_id,
    accessor: 'collectionId',
    Cell: ({ cell: { value } }) => formatCollectionId(value)
  }
];
