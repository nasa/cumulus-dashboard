'use strict';

import {
  fullDate
} from '../format';

export const tableHeader = [
  'Id',
  'Type',
  'Timestamp'
];

export const tableRow = [
  (d) => d['id'],
  'type',
  (d) => fullDate(d['timestamp'])
];
