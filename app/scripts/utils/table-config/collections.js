'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, seconds, tally } from '../format';
import { deleteCollection } from '../../actions';

export const tableHeader = [
  'Name',
  'Status',
  'Errors',
  'User Name',
  'Granules',
  'Duration',
  'Last Update'
];

export const tableRow = [
  (d) => <Link to={`/collections/collection/${d.collectionName}`}>{d.collectionName}</Link>,
  'status',
  () => 0,
  'changedBy',
  (d) => tally(d.granules),
  (d) => seconds(d.averageDuration),
  (d) => fullDate(d.updatedAt)
];

export const tableSortProps = [
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

