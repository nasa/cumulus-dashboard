'use strict';
import React from 'react';
import { Link } from 'react-router-dom';
import { fromNow } from '../format';
import { strings } from '../../components/locale';

export const tableHeader = [
  'Name',
  'Host',
  strings.collections,
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
