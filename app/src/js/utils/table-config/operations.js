import { fromNowWithTooltip, displayCase } from '../format.js';

export const tableColumns = [
  {
    Header: 'Status',
    accessor: (row) => displayCase(row.status),
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
    accessor: 'createdAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'createdAt'
  }
];

export default tableColumns;
