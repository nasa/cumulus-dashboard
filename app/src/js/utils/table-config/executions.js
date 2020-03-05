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
    accessor: row => <Link to={'/executions/execution/' + row.arn} title={row.name}>{truncate(row.name, 24)}</Link>,
    id: 'name'
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
