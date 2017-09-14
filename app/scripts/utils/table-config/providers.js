'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fromNow } from '../format';

export const tableHeader = [
  'Name',
  'Host',
  'Collections',
  'Global Connection Limit',
  'Protocol',
  'Last Updated'
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
