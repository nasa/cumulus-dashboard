'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import { fromNow } from '../format';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`providers/provider/${row.id}`}>{row.id}</Link>,
    id: 'name'
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

