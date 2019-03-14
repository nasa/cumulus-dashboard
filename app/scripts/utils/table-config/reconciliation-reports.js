'use strict';
import React from 'react';
import { Link } from 'react-router';

import { nullValue } from '../format';

export const tableHeader = [
  'Report filename'
];

export const tableRow = [
  (d) => <Link to={`reconciliation-reports/report/${d.reconciliationReportName}`}>{d.reconciliationReportName}</Link>
];

export const tableSortProps = [
  'reconciliationReportName'
];

export const bulkActions = function (reports) {
  return [];
};

export const tableHeaderS3Files = [
  'Filename',
  'Bucket',
  'S3 Link'
];

export const tableRowS3File = [
  (d) => d.filename,
  (d) => d.bucket,
  (d) => d ? <a href={d.path} target='_blank'>Link</a> : nullValue
];

export const tableHeaderGranuleFiles = [
  'GranuleId',
  'Filename',
  'Bucket',
  'S3 Link'
];

export const tableRowGranuleFile = [
  (d) => d.granuleId,
  (d) => d.filename,
  (d) => d.bucket,
  (d) => d ? <a href={d.path} target='_blank'>Link</a> : nullValue
];

export const tablePropsGranuleFile = ['granuleId', 'filename', 'bucket', 'link'];

export const tableHeaderCollections = [
  'Collection name'
];

export const tableRowCollection = [
  (d) => d.name
];

export const tablePropsCollection = ['name'];

export const tableHeaderGranules = [
  'Granule ID'
];

export const tableRowGranule = [
  (d) => d.granuleId
];

export const tablePropsGranule = ['granuleId'];
