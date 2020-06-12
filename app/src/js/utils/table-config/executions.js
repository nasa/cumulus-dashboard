import React from 'react';
import { Link } from 'react-router-dom';
import {
  fromNow,
  seconds,
  displayCase,
  truncate
} from '../../utils/format';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row: { original: { arn, name } } }) => // eslint-disable-line react/prop-types
      <Link to={'/executions/execution/' + arn} title={name}>{truncate(name, 24)}</Link>
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
    Header: strings.collection_name,
    accessor: 'collectionId'
  }
];
