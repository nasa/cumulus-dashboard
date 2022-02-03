import React from 'react';
import { Link } from 'react-router-dom';
import { fromNow, fromNowWithTooltip, tally } from '../format';
import { getPersistentQueryParams } from '../url-helper';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'id',
    Cell: ({ cell: { value } }) => <Link to={(location) => ({ pathname: `/providers/provider/${value}`, search: getPersistentQueryParams(location) })}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Host',
    accessor: 'host'
  },
  {
    Header: 'Global Connection Limit',
    accessor: 'globalConnectionLimit'
  },
  {
    Header: 'Protocol',
    accessor: 'protocol'
  },
  {
    Header: 'Port',
    accessor: 'port'
  },
  {
    Header: 'Last Updated',
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  }
];

export const metaAccessors = [
  {
    label: 'Created',
    property: 'createdAt',
    accessor: fromNow
  },
  {
    label: 'Updated',
    property: 'updatedAt',
    accessor: fromNow
  },
  {
    label: 'Protocol',
    property: 'protocol'
  },
  {
    label: 'Host',
    property: 'host'
  },
  {
    label: 'Port',
    property: 'port'
  },
  {
    label: 'Global Connection Limit',
    property: 'globalConnectionLimit',
    accessor: tally
  },
  {
    label: 'Username (encrypted)',
    property: 'username'
  }
];

export default tableColumns;
