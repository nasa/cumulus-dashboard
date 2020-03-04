'use strict';
import { tally } from '../format';

export const tableColumns = [
  {
    Header: 'Instance ID',
    accessor: 'id'
  },
  {
    Header: 'Status',
    accessor: 'status'
  },
  {
    Header: 'Pending Tasks',
    accessor: row => tally(row['pendingTasks']),
    id: 'pendingTasks'
  },
  {
    Header: 'Running Tasks',
    accessor: row => tally(row['runningTasks']),
    id: 'runningTasks'
  },
  {
    Header: 'Available CPU',
    accessor: 'availableCpu'
  },
  {
    Header: 'Available Memory',
    accessor: 'availableMemory'
  }
];
