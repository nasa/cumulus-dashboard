'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import { fromNow, seconds, bool, collectionLink } from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';

export const tableHeader = [
  'Status',
  'Name',
  'Published',
  'Collection ID',
  'Execution',
  'Duration',
  'Updated'
];

export const tableRow = [
  'status',
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  (d) => d.cmrLink ? <a href={d.cmrLink}>{bool(d.published)}</a> : bool(d.published),
  (d) => collectionLink(d.collectionId),
  (d) => <a href={d.execution}>Link</a>,
  (d) => seconds(d.duration),
  (d) => fromNow(d.timestamp)
];

export const tableSortProps = [
  'status',
  'granuleId',
  'published',
  'collectionId',
  null,
  'duration',
  'timestamp'
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
  (d) => get(d, 'error.Error'),
  (d) => fromNow(d.timestamp)
];

export const errorTableSortProps = [
  'granuleId',
  'published',
  null,
  'timestamp'
];

const confirmReingest = (d) => `Reingest ${d} granules(s)? Note, completed granules cannot be reingested.`;
const confirmRemove = (d) => `Remove ${d} granule(s) from CMR?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;
export const bulkActions = function (granules) {
  return [{
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
