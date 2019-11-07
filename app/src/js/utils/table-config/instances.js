'use strict';
import { tally } from '../format';

export const tableHeader = [
  'Instance ID',
  'Status',
  'Pending Tasks',
  'Running Tasks',
  'Available CPU',
  'Available Memory'
];

export const tableRow = [
  'id',
  'status',
  (d) => tally(d['pendingTasks']),
  (d) => tally(d['runningTasks']),
  'availableCpu',
  'availableMemory'
];
