import { fromNowWithTooltip, displayCase } from '../format';

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
    Header: 'Updated',
    accessor: 'updatedAt',
    Cell: ({ cell: { value } }) => fromNowWithTooltip(value),
    id: 'updatedAt'
  }
];

export default tableColumns;
