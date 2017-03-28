'use strict';
import { tally } from '../format';

export const tableHeader = [
  'Service Name',
  'Status',
  'Desired Tasks',
  'Pending Tasks',
  'Running Tasks'
];

export const tableRow = [
  'name',
  'status',
  (d) => tally(d['desiredCount']),
  (d) => tally(d['pendingCount']),
  (d) => tally(d['runningCount'])
];
