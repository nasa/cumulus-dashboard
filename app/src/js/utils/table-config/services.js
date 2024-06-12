import { tally } from '../format.js';

export const tableColumns = [
  {
    Header: 'Service Name',
    accessor: 'name'
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Desired Tasks',
    accessor: (row) => tally(row.desiredCount),
    id: 'desiredCount'
  },
  {
    Header: 'Pending Tasks',
    accessor: (row) => tally(row.pendingCount),
    id: 'pendingCount'
  },
  {
    Header: 'Running Tasks',
    accessor: (row) => tally(row.runningCount),
    id: 'runningCount'
  }
];

export default tableColumns;
