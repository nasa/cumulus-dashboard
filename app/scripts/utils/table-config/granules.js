'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, seconds, bool } from '../format';

export const tableHeader = [
  'Name',
  'Status',
  'Published',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  (d) => bool(d.published),
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

export const tableSortProps = [
  'granuleId.keyword',
  'status.keyword',
  'published.keyword',
  'pdrName.keyword',
  'collectionName.keyword',
  'duration',
  'updatedAt'
];
