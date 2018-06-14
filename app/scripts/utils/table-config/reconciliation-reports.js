'use strict';
import React from 'react';
import { Link } from 'react-router';

export const tableHeader = [
  'Report filename'
];

export const tableRow = [
  (d) => <Link to={`reconciliation-reports/report/${d.reconciliationReportName}`}>{d.reconciliationReportName}</Link>
];

export const tableSortProps = [
  'reconciliationReportName'
];
