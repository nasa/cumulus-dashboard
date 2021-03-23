import React from 'react';
import { Link } from 'react-router-dom';
import {
  displayCase,
  seconds,
  fromNowWithTooltip,
  formatCollectionId
} from '../format';
import { strings } from '../../components/locale';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'name',
    width: 150,
    Cell: ({ row: { original: { arn, name } } }) => ( // eslint-disable-line react/prop-types
      <Link to={(location) => ({ pathname: `/executions/execution/${arn}`, search: getPersistentQueryParams(location) })} title={name}>{name}</Link>)
  },
  {
    Header: 'Status',
    accessor: (row) => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Workflow',
    accessor: 'type',
    width: 150
  },
  {
    Header: 'Created',
    accessor: 'createdAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'createdAt'
  },
  {
    Header: 'Duration',
    accessor: (row) => seconds(row.duration),
    id: 'duration',
    width: 75
  },
  {
    Header: strings.collection_id,
    accessor: 'collectionId',
    width: 200,
    Cell: ({ cell: { value } }) => formatCollectionId(value)
  }
];

export default tableColumns;
