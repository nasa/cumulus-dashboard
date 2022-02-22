export const reconciliationReportTypes = [
  {
    id: 'Granule Not Found',
    label: 'Granule Not Found',
    description: 'This report displays the granules that were not found in each bucket.',
  },
  {
    id: 'Internal',
    label: 'Internal',
    description: 'This report compares the collections and granules that are in DynamoDB versus ElasticSearch.',
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
  {
    id: 'Bulk Granules',
    label: 'Bulk Granules',
  },
  {
    id: 'ES Index',
    label: 'ES Index',
  },
  {
    id: 'Bulk Delete',
    label: 'Bulk Delete',
  },
  {
    id: 'Kinesis Replay',
    label: 'Kinesis Replay',
  },
];
