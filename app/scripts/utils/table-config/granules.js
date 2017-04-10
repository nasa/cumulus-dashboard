'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, seconds, bool, nullValue } from '../format';
import {
  reprocessGranule,
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';

export const tableHeader = [
  'Name',
  'Status',
  'Published',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  (d) => bool(d.published),
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

export const tableSortProps = [
  'granuleId.keyword',
  'status.keyword',
  'published.keyword',
  'pdrName.keyword',
  'collectionName.keyword',
  'duration',
  'updatedAt'
];

export const errorTableHeader = [
  'Name',
  'Published',
  'Error',
  'Updated'
];

export const errorTableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  (d) => bool(d.published),
  (d) => d.error || nullValue,
  (d) => fullDate(d.updatedAt)
];

export const errorTableSortProps = [
  'granuleId.keyword',
  'published.keyword',
  'error.keyword',
  'updatedAt'
];

const confirmReprocess = (d) => `Reprocess ${d} granule(s)?`;
const confirmReingest = (d) => `Reingest ${d} granules(s)? Note, completed granules cannot be reingested.`;
const confirmRemove = (d) => `Remove ${d} granule(s) from CMR?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;
export const bulkActions = function (granules) {
  return [{
    text: 'Reprocess',
    action: reprocessGranule,
    state: granules.reprocessed,
    confirm: confirmReprocess
  }, {
    text: 'Reingest',
    action: reingestGranule,
    state: granules.reingested,
    confirm: confirmReingest
  }, {
    text: 'Remove from CMR',
    action: removeGranule,
    state: granules.removed,
    confirm: confirmRemove
  }, {
    text: 'Delete',
    action: deleteGranule,
    state: granules.deleted,
    confirm: confirmDelete
  }];
};
