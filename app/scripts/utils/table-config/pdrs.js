'use strict';
import React from 'react';
import { Link } from 'react-router';
import { get } from 'object-path';
import { tally, seconds, fullDate, bool, nullValue } from '../format';
import { deletePdr } from '../../actions';

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
  (d) => fullDate(d.timestamp),
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
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
  'timestamp',
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

export const errorTableHeader = [
  'Updated',
  'Name',
  'Error',
  'PDRD Sent'
];

export const errorTableRow = [
  (d) => fullDate(d.timestamp),
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  (d) => d.PDRD || d.error || nullValue,
  (d) => bool(d.PDRDSent)
];

export const errorTableSortProps = [
  'timestamp',
  'pdrName.keyword',
  'PDRD.keyword',
  null
];

const confirmDelete = (d) => `Delete ${d} PDR(s)?`;
export const bulkActions = function (pdrs) {
  return [{
    text: 'Delete',
    action: deletePdr,
    state: pdrs.deleted,
    confirm: confirmDelete
  }];
};
