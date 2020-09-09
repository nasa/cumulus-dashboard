export const reconciliationReportTypes = [
  {
    id: 'Granule Not Found',
    label: 'Granule Not Found',
    description: 'This report displays the granules that were not found in each bucket.',
  },
  {
    id: 'Internal',
    label: 'Internal',
    description: 'This report compares the granules that are in DynamoDB versus ElasticSearch.',
  },
  {
    id: 'Inventory',
    label: 'Inventory',
    description: 'This report allows you to select what bucket (s3, Cumulus, S3 Glacier, CMR) you would like to generate validation for all granules for a duration.',
  },
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
