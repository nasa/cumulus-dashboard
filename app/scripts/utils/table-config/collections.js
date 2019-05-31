'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router';
import { fromNow, seconds, tally, collectionNameVersion } from '../format';
import { deleteCollection, recoverCollection } from '../../actions';
import { strings } from '../../components/locale';

export const tableHeader = [
  'Name',
  'Version',
  strings.granules,
  'Completed',
  'Running',
  'Failed',
  'MMT',
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
  (d) => d.mmtLink ? <a href={d.mmtLink} target="_blank">MMT</a> : null,
  (d) => seconds(d.duration),
  (d) => fromNow(d.timestamp)
];

export const tableSortProps = [
  'name',
  'version',
  null,
  null,
  null,
  null,
  null,
  'duration',
  'timestamp'
];

const confirmRecover = (d) => `Recover ${d} ${strings.collection}(s)?`;
export const recoverAction = function (collections, config) {
  return [{
    text: 'Recover',
    action: config.recover.action,
    state: collections.executed, // this will probably need to be changed
    confirm: confirmRecover
  }];
};

const confirmDelete = (d) => `Delete ${d} ${strings.collection}(s)?`;
export const bulkActions = function (collections) {
  return [{
    text: 'Delete',
    action: (collectionId) => {
      const { name, version } = collectionNameVersion(collectionId);
      return deleteCollection(name, version);
    },
    state: collections.deleted,
    confirm: confirmDelete
  }];
};
