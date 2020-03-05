'use strict';
import React from 'react';
import { get } from 'object-path';
import { Link } from 'react-router-dom';
import { fromNow, seconds, tally, collectionNameVersion } from '../format';
import { deleteCollection } from '../../actions';
import { strings } from '../../components/locale';

export const tableColumns = [
  {
    Header: 'Name',
    accessor: row => <Link to={`/collections/collection/${row.name}/${row.version}`}>{row.name}</Link>,
    id: 'name',
    width: 175
  },
  {
    Header: 'Version',
    accessor: 'version'
  },
  {
    Header: strings.granules,
    accessor: row => tally(get(row, 'stats.total')),
    id: 'granules',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Completed',
    accessor: row => tally(get(row, 'stats.completed')),
    id: 'completed',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Running',
    accessor: row => tally(get(row, 'stats.running')),
    id: 'running',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Failed',
    accessor: row => tally(get(row, 'stats.failed')),
    id: 'failed',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'MMT',
    accessor: row => row.mmtLink ? <a href={row.mmtLink} target="_blank">MMT</a> : null,
    id: 'mmtLink',
    disableSortBy: true,
    width: 100
  },
  {
    Header: 'Duration',
    accessor: row => seconds(row.duration),
    id: 'duration'
  },
  {
    Header: 'Timestamp',
    accessor: row => fromNow(row.timestamp),
    id: 'timestamp'
  }
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
  return [
    {
      Component: <Link className='button button--green button--add button--small form-group__element' to='/collections/add' role="button">{strings.add_collection}</Link>
    },
    {
      text: 'Delete Collection',
      action: (collectionId) => {
        const { name, version } = collectionNameVersion(collectionId);
        return deleteCollection(name, version);
      },
      state: collections.deleted,
      confirm: confirmDelete,
      className: 'button button--delete button--small form-group__element'
    }
  ];
};
