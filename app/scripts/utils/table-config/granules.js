'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, seconds, bool, nullValue, collectionLink } from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';

export const tableHeader = [
  'Name',
  'Status',
  'Published',
  'Collection ID',
  'Execution',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  (d) => d.cmrLink ? <a href={d.cmrLink}>{bool(d.published)}</a> : bool(d.published),
  (d) => collectionLink(d.collectionId),
  (d) => <a href={d.execution}>Link</a>,
  (d) => seconds(d.duration),
  (d) => fullDate(d.timestamp)
];

export const tableSortProps = [
  'granuleId',
  'status',
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
  (d) => d.error || nullValue,
  (d) => fullDate(d.timestamp)
];

export const errorTableSortProps = [
  'granuleId.keyword',
  'published.keyword',
  'error.keyword',
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
