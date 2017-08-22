'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, nullValue } from '../format';
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
  (d) => <Link to={`providers/provider/${d.id}`}>{d.id}</Link>,
  'providerName',
  'status',
  'collections',
  'protocol',
  (d) => fullDate(d.createdAt)
];

export const tableSortProps = [
  'id',
  'providerName.keyword',
  'status.keyword',
  null,
  'protocol.keyword',
  'updatedAt'
];

export const errorTableHeader = [
  'Name',
  'Group',
  'Error',
  'Protocol',
  'Last Update'
];

export const errorTableRow = [
  (d) => <Link to={`providers/provider/${d.name}`}>{d.name}</Link>,
  'providerName',
  (d) => d.error || nullValue,
  'protocol',
  (d) => fullDate(d.createdAt)
];

export const errorTableSortProps = [
  'name.keyword',
  'providerName.keyword',
  'error.keyword',
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
