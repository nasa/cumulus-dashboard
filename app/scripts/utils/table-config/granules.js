'use strict';
import React from 'react';
import { Link } from 'react-router';
import { fullDate, seconds } from '../format';

export const tableHeader = [
  '',
  'Name',
  'Status',
  'PDR',
  'Collection',
  'Duration',
  'Updated'
];

export const tableRow = [
  (d) => <input type='checkbox' className='form-checkbox'/>,
  (d) => <Link to={`/granules/granule/${d.granuleId}/overview`}>{d.granuleId}</Link>,
  'status',
  'pdrName',
  'collectionName',
  (d) => seconds(d.duration),
  (d) => fullDate(d.updatedAt)
];

export const tableSortProps = [
  'granuleId.keyword',
  'status.keyword',
  'pdrName.keyword',
  'collectionName.keyword',
  'duration',
  'updatedAt'
];
