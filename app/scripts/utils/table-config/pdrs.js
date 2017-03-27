'use strict';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { tally, seconds, fullDate } from '../format';

export const tableHeader = [
  'Updated',
  'Name',
  'Status',
  'Duration',
  'Granules',
  'Ingesting',
  'Processing',
  'Updating CMR',
  'Archiving',
  'Failed',
  'Completed'
];

export const tableRow = [
  (d) => fullDate(d.updatedAt),
  (d) => <Link to={`granules/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  (d) => seconds(d.averageDuration),
  (d) => tally(get(d, 'granules', 0)),
  (d) => tally(get(d, ['granulesStatus', 'ingesting'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'processing'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'cmr'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'archiving'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'failed'], 0)),
  (d) => tally(get(d, ['granulesStatus', 'completed'], 0))
];

export const tableSortProps = [
  'updatedAt',
  'pdrName.keyword',
  'status.keyword',
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];
