'use strict';
import { tally } from '../format';

export const tableColumns = [
  {
    Header: 'Queue',
    id: 'name'
  },
  {
    Header: 'Messages Available',
    accessor: row => tally(row['messagesAvailable']),
    id: 'messagesAvailable'
  },
  {
    Header: 'Messages in Flight',
    accessor: row => tally(row['messagesInFlight']),
    id: 'messagesInFlight'
  }
];
