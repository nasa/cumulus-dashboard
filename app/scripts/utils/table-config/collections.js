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
  'Failed',
  'Duration',
  'Timestamp'
];

export const tableRow = [
  (d) => <Link to={`/collections/collection/${d.name}/${d.version}`}>{d.name}</Link>,
  'version',
  (d) => tally(get(d, 'stats.properties.total')),
  (d) => tally(get(d, 'stats.properties.completed')),
  (d) => tally(get(d, 'stats.properties.failed')),
  (d) => seconds(d.duration),
  (d) => fullDate(d.timestamp)
];

export const tableSortProps = [
  'name',
  'version',
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
