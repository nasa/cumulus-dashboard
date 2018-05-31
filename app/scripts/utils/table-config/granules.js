'use strict';
import path from 'path';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import {
  fromNow,
  seconds,
  bool,
  nullValue,
  displayCase,
  collectionLink,
  granuleLink
} from '../format';
import {
  reingestGranule,
  removeGranule,
  deleteGranule
} from '../../actions';
import ErrorReport from '../../components/errors/report';
import {strings} from '../../components/locale';

export const tableHeader = [
  'Status',
  'Name',
  'Published',
  strings.collection_id,
  'Execution',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <Link to={`/granules/${d.status}`} className={`granule__status granule__status--${d.status}`}>{displayCase(d.status)}</Link>,
  (d) => granuleLink(d.granuleId),
  (d) => d.cmrLink ? <a href={d.cmrLink} target='_blank'>{bool(d.published)}</a> : bool(d.published),
  (d) => collectionLink(d.collectionId),
  (d) => <Link to={`/executions/execution/${path.basename(d.execution)}`}>link</Link>,
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
  'Error',
  'Type',
  'Granule',
  'Duration',
  'Updated'
];

export const errorTableRow = [
  (d) => <ErrorReport report={get(d, 'error.Cause', nullValue)} truncate={true} />,
  (d) => get(d, 'error.Error', nullValue),
  (d) => granuleLink(d.granuleId),
  (d) => seconds(d.duration),
  (d) => fromNow(d.timestamp)
];

export const errorTableSortProps = [
  null,
  null,
  'granuleId',
  'duration',
  'timestamp'
];

const confirmReingest = (d) => `Reingest ${d} granules(s)? Note, completed granules cannot be reingested.`;
const confirmRemove = (d) => `Remove ${d} granule(s) from OnEarth?`;
const confirmDelete = (d) => `Delete ${d} granule(s)?`;
export const bulkActions = function (granules) {
  return [{
    text: 'Reingest',
    action: reingestGranule,
    state: granules.reingested,
    confirm: confirmReingest
  }, {
    text: strings.remove_from_cmr,
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
