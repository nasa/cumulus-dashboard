'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import { fullDate, seconds, tally } from '../format';
import { deleteCollection } from '../../actions';

export const tableHeader = [
  'Name',
  'Version',
  'Granules',
  'Completed',
  'Running',
  'Failed',
  'Duration',
  'Timestamp'
];

export const tableRow = [
  (d) => <Link to={`/collections/collection/${d.name}/${d.version}`}>{d.name}</Link>,
  'version',
  (d) => tally(get(d, 'stats.total')),
  (d) => tally(get(d, 'stats.completed')),
  (d) => tally(get(d, 'stats.running')),
  (d) => tally(get(d, 'stats.failed')),
  (d) => seconds(d.duration),
  (d) => fullDate(d.timestamp)
];

export const tableSortProps = [
  'name',
  'version',
  null,
  null,
  null,
  null,
  'duration',
  'timestamp'
];

const confirmDelete = (d) => `Delete ${d} collections(s)?`;
export const bulkActions = function (collections) {
  return [{
    text: 'Delete',
    action: deleteCollection,
    state: collections.deleted,
    confirm: confirmDelete
  }];
};
