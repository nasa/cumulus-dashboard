'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate } from '../format';
import { deleteProvider, restartProvider, stopProvider } from '../../actions';

export const tableHeader = [
  'Name',
  'Group',
  'Status',
  'Collections',
  'Protocol',
  'Last Update'
];

export const tableRow = [
  (d) => <Link to={`providers/provider/${d.name}`}>{d.name}</Link>,
  'providerName',
  'status',
  'collections',
  'protocol',
  (d) => fullDate(d.createdAt)
];

export const tableSortProps = [
  'name.keyword',
  'providerName.keyword',
  'status.keyword',
  null,
  'protocol.keyword',
  'updatedAt'
];

const confirmDelete = (d) => `Delete ${d} Provider(s)?`;
const confirmRestart = (d) => `Restart ${d} Provider(s)?`;
const confirmStop = (d) => `Stop ${d} Provider(s)?`;
export const bulkActions = function (providers) {
  return [{
    text: 'Stop',
    action: stopProvider,
    state: providers.stopped,
    confirm: confirmStop
  }, {
    text: 'Restart',
    action: restartProvider,
    state: providers.restarted,
    confirm: confirmRestart
  }, {
    text: 'Delete',
    action: deleteProvider,
    state: providers.deleted,
    confirm: confirmDelete
  }];
};
