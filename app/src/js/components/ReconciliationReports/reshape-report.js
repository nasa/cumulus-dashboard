'use strict';
/* eslint node/no-deprecated-api: 0 */
import path from 'path';
import {
  tableColumnsCollections,
  tableColumnsFiles,
  tableColumnsGranules,
  tableColumnsS3Files,
} from '../../utils/table-config/reconciliation-reports';
import url from 'url';

const getFilesSummary = ({ onlyInDynamoDb = [], onlyInS3 = [] }) => {
  const filesInS3 = onlyInS3.map((d) => {
    const parsed = url.parse(d);
    return {
      filename: path.basename(parsed.pathname),
      bucket: parsed.hostname,
      path: parsed.href,
    };
  });

  const filesInDynamoDb = onlyInDynamoDb.map(parseFileObject);

  return { filesInS3, filesInDynamoDb };
};

const getCollectionsSummary = ({ onlyInCumulus = [], onlyInCmr = [] }) => {
  const getCollectionName = (collectionName) => ({ name: collectionName });
  const collectionsInCumulus = onlyInCumulus.map(getCollectionName);
  const collectionsInCmr = onlyInCmr.map(getCollectionName);
  return { collectionsInCumulus, collectionsInCmr };
};

const getGranulesSummary = ({ onlyInCumulus = [], onlyInCmr = [] }) => {
  const granulesInCumulus = onlyInCumulus;
  const granulesInCmr = onlyInCmr.map((granule) => ({
    granuleId: granule.GranuleUR,
  }));
  return { granulesInCumulus, granulesInCmr };
};

const getGranuleFilesSummary = ({ onlyInCumulus = [], onlyInCmr = [] }, filterBucket) => {
  const granuleFilesOnlyInCumulus = onlyInCumulus.map(parseFileObject);

  const granuleFilesOnlyInCmr = onlyInCmr.map((d) => {
    const parsed = url.parse(d.URL);
    const bucket = parsed.hostname.split('.')[0];
    return {
      granuleId: d.GranuleUR,
      filename: path.basename(parsed.pathname),
      bucket,
      path: `s3://${bucket}${parsed.pathname}`,
    };
  });

  return { granuleFilesOnlyInCumulus, granuleFilesOnlyInCmr };
};

const parseFileObject = (d) => {
  const parsed = url.parse(d.uri);
  return {
    granuleId: d.granuleId,
    filename: path.basename(parsed.pathname),
    bucket: parsed.hostname,
    path: parsed.href,
  };
};

export const reshapeReport = (record, filterString, filterBucket) => {
  let filesInS3 = [];
  let filesInDynamoDb = [];

  let granuleFilesOnlyInCumulus = [];
  let granuleFilesOnlyInCmr = [];

  let collectionsInCumulus = [];
  let collectionsInCmr = [];

  let granulesInCumulus = [];
  let granulesInCmr = [];

  if (record && record.data) {
    const {
      filesInCumulus: internalCompareFiles = {},
      filesInCumulusCmr: compareFiles = {},
      collectionsInCumulusCmr: compareCollections = {},
      granulesInCumulusCmr: compareGranules = {},
    } = record.data;

    ({ filesInS3, filesInDynamoDb } = getFilesSummary(internalCompareFiles, filterBucket));

    ({ collectionsInCumulus, collectionsInCmr } = getCollectionsSummary(
      compareCollections
    ));

    ({ granulesInCumulus, granulesInCmr } = getGranulesSummary(
      compareGranules
    ));

    ({
      granuleFilesOnlyInCumulus,
      granuleFilesOnlyInCmr,
    } = getGranuleFilesSummary(compareFiles, filterBucket));
  }

  if (filterString) {
    filesInDynamoDb = filesInDynamoDb.filter((file) => file.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    filesInS3 = filesInS3.filter((file) => file.filename.toLowerCase().includes(filterString.toLowerCase()));

    collectionsInCumulus = collectionsInCumulus.filter((collection) => collection.name.toLowerCase().includes(filterString.toLowerCase()));
    collectionsInCmr = collectionsInCmr.filter((collection) => collection.name.toLowerCase().includes(filterString.toLowerCase()));

    granulesInCumulus = granulesInCumulus.filter((granule) => granule.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    granulesInCmr = granulesInCmr.filter((granule) => granule.granuleId.toLowerCase().includes(filterString.toLowerCase()));

    granuleFilesOnlyInCumulus = granuleFilesOnlyInCumulus.filter((file) => file.granuleId.toLowerCase().includes(filterString.toLowerCase()));
    granuleFilesOnlyInCmr = granuleFilesOnlyInCmr.filter((file) => file.granuleId.toLowerCase().includes(filterString.toLowerCase()));
  }

  const getBucket = (item) => (item.bucket);
  const allBuckets = [
    ...filesInS3.map(getBucket),
    ...filesInDynamoDb.map(getBucket),
    ...granuleFilesOnlyInCumulus.map(getBucket),
    ...granuleFilesOnlyInCmr.map(getBucket),
  ];

  const filterOnBucket = (file) => (file.bucket === filterBucket);

  if (filterBucket) {
    filesInS3 = filesInS3.filter(filterOnBucket);
    filesInDynamoDb = filesInDynamoDb.filter(filterOnBucket);
    granuleFilesOnlyInCumulus = granuleFilesOnlyInCumulus.filter(filterOnBucket);
    granuleFilesOnlyInCmr = granuleFilesOnlyInCmr.filter(filterOnBucket);
  }

  /**
   * The reconciation report display mechanism is set up to display cards as
   * headers for cumulus internal consistency as well as comparison between
   * Cumulus and CMR.  We set up a configuration from the intput record to ease
   * the display of that information.
   *
   * The comparison configuration should consist of an Array of Objects, where
   * the objects have keys `id` used for selection and 'tables' which should be
   * an array of Objects that are passed to Sortabletable.
   */
  const internalComparison = [
    {
      id: 'dynamo',
      name: 'DynamoDB',
      tables: [
        {
          id: 'dynamoNotS3',
          name: 'Files in DynamoDb not found in S3',
          data: filesInDynamoDb,
          columns: tableColumnsFiles,
        },
      ],
    },
    {
      id: 's3',
      name: 'S3',
      tables: [
        {
          id: 's3NotDynamo',
          name: 'Files in S3 not found in DynamoDb',
          data: filesInS3,
          columns: tableColumnsS3Files,
        },
      ],
    },
  ];

  const cumulusVsCmrComparison = [
    {
      id: 'cumulusOnly',
      name: 'Cumulus',
      tables: [
        {
          id: 'cumulusCollections',
          name: 'Collections only in Cumulus',
          data: collectionsInCumulus,
          columns: tableColumnsCollections,
        },
        {
          id: 'cumulusGranules',
          name: 'Granules only in Cumulus',
          data: granulesInCumulus,
          columns: tableColumnsGranules,
        },
        {
          id: 'cumulusFiles',
          name: 'Files only in Cumulus',
          data: granuleFilesOnlyInCumulus,
          columns: tableColumnsFiles,
        },
      ],
    },
    {
      id: 'cmrOnly',
      name: 'CMR',
      tables: [
        {
          id: 'cmrCollections',
          name: 'Collections only in CMR',
          data: collectionsInCmr,
          columns: tableColumnsCollections,
        },
        {
          id: 'cmrGranules',
          name: 'Granules only in CMR',
          data: granulesInCmr,
          columns: tableColumnsGranules,
        },
        {
          id: 'cmrFiles',
          name: 'Files only in CMR',
          data: granuleFilesOnlyInCmr,
          columns: tableColumnsFiles,
        },
      ],
    },
  ];

  return { internalComparison, cumulusVsCmrComparison, allBuckets };
};
