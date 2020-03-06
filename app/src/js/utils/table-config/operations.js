import { fromNow, displayCase } from '../../utils/format';

export const tableColumns = [
  {
    Header: 'Status',
    accessor: row => displayCase(row.status),
    id: 'status'
  },
  {
    Header: 'Async ID',
    accessor: 'id'
  },
  {
    Header: 'Description',
    accessor: 'description',
    disableSortBy: true
  },
  {
    Header: 'Type',
    accessor: 'operationType'
  },
  {
    Header: 'Created',
    accessor: row => fromNow(row.createdAt),
    id: 'createdAt'
  }
];
