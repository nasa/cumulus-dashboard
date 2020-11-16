import React from 'react';
import { Link } from 'react-router-dom';
import { fromNowWithTooltip } from '../format';
import { strings } from '../../components/locale';
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
    accessor: 'timestamp',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'timestamp'
  }
];

export default tableColumns;
