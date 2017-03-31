'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate } from '../format';

export const tableHeader = [
  'Name',
  'Group',
  'Status',
  'Collections',
  'Errors',
  'Protocol',
  'Last Update'
];

export const tableRow = [
  (d) => <Link to={`providers/provider/${d.name}`}>{d.name}</Link>,
  'providerName',
  'status',
  'collections',
  (d) => '?',
  'protocol',
  (d) => fullDate(d.createdAt)
];

export const tableSortProps = [
  'name.keyword',
  'providerName.keyword',
  'status.keyword',
  null,
  null,
  'protocol.keyword',
  'updatedAt'
];
