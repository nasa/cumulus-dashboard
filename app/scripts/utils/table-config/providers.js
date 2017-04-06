'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate } from '../format';
import { deleteProvider } from '../../actions';

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
export const bulkActions = function (providers) {
  return [{
    text: 'Delete',
    action: deleteProvider,
    state: providers.deleted,
    confirm: confirmDelete
  }];
};
