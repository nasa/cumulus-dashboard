'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fromNow } from '../format';
import { deleteProvider, restartProvider, stopProvider } from '../../actions';

export const tableHeader = [
  'Name',
  'Host',
  'Collections',
  'Global Connection Limit',
  'Protocol',
  'Timestamp'
];

export const tableRow = [
  (d) => <Link to={`providers/provider/${d.id}`}>{d.id}</Link>,
  'host',
  'collections',
  'globalConnectionLimit',
  'protocol',
  (d) => fromNow(d.timestamp)
];

export const tableSortProps = [
  'id',
  'host',
  'collections',
  'globalConnectionLimit',
  'protocol',
  'timestamp'
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
