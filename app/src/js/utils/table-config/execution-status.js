'use strict';

import { fullDate } from '../format';

export const tableColumns = [
  {
    Header: 'Id',
    accessor: row => row['id'],
    id: 'id'
  },
  {
    Header: 'Type',
    accessor: 'type'
  },
  {
    Header: 'Timestamp',
    accessor: row => fullDate(row['timestamp']),
    id: 'timestamp'
  },
  {
    Header: 'Input Details',
    accessor: 'inputDetails'
  }
];
