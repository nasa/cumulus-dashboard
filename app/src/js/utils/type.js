export const reconciliationReportTypes = [
  {
    id: 'Granule Not Found',
    label: 'Granule Not Found',
    description: 'This report displays the granules that were not found in each bucket.',
  },
  {
    id: 'Inventory',
    label: 'Inventory',
    description: 'This report allows you to select what bucket (s3, Cumulus, CMR) you would like to generate validation for all collections, granules and files for a duration.',
  },
  {
    id: 'ORCA Backup',
    label: 'ORCA Backup',
    description: 'This report compares the files that are in storage. This includes the Database versus what is in S3 Glacier/ORCA Backup.'
  }
];

export const operationTypes = [
  'Bulk Granule Delete',
  'Bulk Granule Reingest',
  'Bulk Granules',
  'Bulk Execution Delete',
  'Data Migration',
  'Dead-Letter Processing',
  'DLA Migration',
  'ES Index',
  'Kinesis Replay',
  'Reconciliation Report',
  'SQS Replay',
].map((name) => ({ id: name, label: name }));
