'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'object-path';
import { seconds, fromNow, bool, nullValue } from '../format';
import { deletePdr } from '../../actions';
import { strings } from '../../components/locale';

export const tableHeader = [
  'Updated',
  'Name',
  'Status',
  'Duration',
  strings.granules,
  'Processing',
  'Failed',
  'Completed'
];

export const tableRow = [
  (d) => fromNow(d.timestamp),
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  'status',
  (d) => seconds(d.duration),
  (d) => Object.keys(d.stats).filter(k => k !== 'total')
    .reduce((a, b) => a + get(d.stats, b, 0), 0),
  (d) => get(d, ['stats', 'processing'], 0),
  (d) => get(d, ['stats', 'failed'], 0),
  (d) => get(d, ['stats', 'completed'], 0)
];

export const tableSortProps = [
  'timestamp',
  'pdrName.keyword',
  'status.keyword',
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
  'PAN Sent',
  'PAN Message'
];

export const errorTableRow = [
  (d) => fromNow(d.timestamp),
  (d) => <Link to={`pdrs/pdr/${d.pdrName}`}>{d.pdrName}</Link>,
  (d) => get(d, 'error.Cause', nullValue),
  (d) => bool(d.PANSent),
  'PANmessage'
];

export const errorTableSortProps = [
  'timestamp',
  'pdrName',
  null,
  'PANSent',
  'PANmessage'
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
