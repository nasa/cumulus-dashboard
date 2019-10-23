'use strict';

import {
  fullDate
} from '../format';

export const tableHeader = [
  'Id',
  'Type',
  'Timestamp',
  'Input Details'
];

export const tableRow = [
  (d) => d['id'],
  'type',
  (d) => fullDate(d['timestamp'])
];
