'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import { fromNow } from '../format';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: 'id',
    Cell: ({ cell: { value } }) => <Link to={`providers/provider/${value}`}>{value}</Link> // eslint-disable-line react/prop-types
  },
  {
    Header: 'Host',
    accessor: 'host'
  },
  {
    Header: strings.collections,
    accessor: 'collections'
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
    Header: 'Last Updated',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
];
