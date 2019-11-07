'use strict';
import { tally } from '../format';

export const tableHeader = [
  'Queue',
  'Messages Available',
  'Messages in Flight'
];

export const tableRow = [
  'name',
  (d) => tally(d['messagesAvailable']),
  (d) => tally(d['messagesInFlight'])
];
