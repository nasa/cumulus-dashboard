'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import { fullDate, seconds, tally } from '../format';
import { deleteCollection } from '../../actions';

export const tableHeader = [
  'Name',
  'Granules',
  'Completed',
  'Failed',
  'Duration',
  'Created at',
  'Updated at'
];

export const tableRow = [
  (d) => <Link to={`/collections/collection/${d.collectionName}`}>{d.collectionName}</Link>,
  (d) => tally(d.granules),
  (d) => tally(get(d, 'granulesStatus.completed')),
  (d) => tally(get(d, 'granulesStatus.failed')),
  (d) => seconds(d.averageDuration),
  (d) => fullDate(d.createdAt),
  (d) => fullDate(d.updatedAt)
];

export const tableSortProps = [
  'collectionName.keyword',
  'granules',
  null,
  null,
  'averageDuration',
  'createdAt',
  'updatedAt'
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
