/* eslint node/no-deprecated-api: 0 */
import path from 'path';
import url from 'url';
import { getCollectionId } from '../../utils/format';
import {
  tableColumnsCollections,
  tableColumnsFiles,
  tableColumnsGranules,
  tableColumnsS3Files,
} from '../../utils/table-config/reconciliation-reports';

export const getFilesSummary = ({ onlyInDynamoDb = [], onlyInS3 = [], okCountByGranule }) => {
  const filesInS3 = onlyInS3.map((d) => {
    const parsed = url.parse(d);
    return {
      filename: path.basename(parsed.pathname),
      bucket: parsed.hostname,
      path: parsed.href,
    };
  });

  const filesInDynamoDb = onlyInDynamoDb.map((file) => {
    const parsedFile = parseFileObject(file);
    const { granuleId } = parsedFile;
    let s3 = false;
    if (okCountByGranule) {
      s3 = okCountByGranule[granuleId] > 0 ? 'missing' : 'notFound';
    }
    return {
      s3,
      cumulus: true,
      ...parsedFile
    };
  });

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
    collectionId: getCollectionId({ name: granule.ShortName, version: granule.Version })
  }));
  return { granulesInCumulus, granulesInCmr };
};

export const getGranuleFilesSummary = ({ onlyInCumulus = [], onlyInCmr = [] }) => {
  const granuleFilesOnlyInCumulus = onlyInCumulus.map((file) => {
    const parsedFile = parseFileObject(file);
    return {
      cmr: 'missing',
      ...parsedFile
    };
  });

  const granuleFilesOnlyInCmr = onlyInCmr.map((d) => {
    const parsed = url.parse(d.URL);
    const bucket = parsed.hostname.split('.')[0];
    return {
      granuleId: d.GranuleUR,
      filename: path.basename(parsed.pathname),
      bucket,
      path: `s3://${bucket}${parsed.pathname}`,
      cumulus: 'missing'
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

export const reshapeReport = (recordData, filterString, filterBucket) => {
  let filesInS3 = [];
  let filesInDynamoDb = [];

  let granuleFilesOnlyInCumulus = [];
  let granuleFilesOnlyInCmr = [];

  let collectionsInCumulus = [];
  let collectionsInCmr = [];

  let granulesInCumulus = [];
  let granulesInCmr = [];

  if (recordData) {
    const {
      filesInCumulus: internalCompareFiles = {},
      filesInCumulusCmr: compareFiles = {},
      collectionsInCumulusCmr: compareCollections = {},
      granulesInCumulusCmr: compareGranules = {},
    } = recordData;

    ({ filesInS3, filesInDynamoDb } = getFilesSummary(internalCompareFiles));

    ({ collectionsInCumulus, collectionsInCmr } = getCollectionsSummary(
      compareCollections
    ));

    ({ granulesInCumulus, granulesInCmr } = getGranulesSummary(
      compareGranules
    ));

    ({
      granuleFilesOnlyInCumulus,
      granuleFilesOnlyInCmr,
    } = getGranuleFilesSummary(compareFiles));
  }

  if (filterString) {
    filesInDynamoDb = filesInDynamoDb.filter((file) => file.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
    filesInS3 = filesInS3.filter((file) => file.filename.toLowerCase().includes(filterString.toLowerCase()));

    collectionsInCumulus = collectionsInCumulus.filter((collection) => collection.name.toLowerCase()
      .includes(filterString.toLowerCase()));
    collectionsInCmr = collectionsInCmr.filter((collection) => collection.name.toLowerCase()
      .includes(filterString.toLowerCase()));

    granulesInCumulus = granulesInCumulus.filter((granule) => granule.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
    granulesInCmr = granulesInCmr.filter((granule) => granule.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));

    granuleFilesOnlyInCumulus = granuleFilesOnlyInCumulus.filter((file) => file.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
    granuleFilesOnlyInCmr = granuleFilesOnlyInCmr.filter((file) => file.granuleId.toLowerCase()
      .includes(filterString.toLowerCase()));
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
   * The reconciliation report display mechanism is set up to display cards as
   * headers for cumulus internal consistency as well as comparison between
   * Cumulus and CMR.  We set up a configuration from the input record to ease
   * the display of that information.
   *
   * The comparison configuration should consist of an Array of Objects, where
   * the objects have keys `id` used for selection and 'tables' which should be
   * an array of Objects that are passed to SortableTable.
   */
  const internalComparison = [
    {
      id: 'dynamo',
      name: 'DynamoDB',
      tables: [
        {
          id: 'dynamoNotS3',
          name: 'Files in DynamoDb not found in S3',
          type: 'file',
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
          type: 'file',
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
          type: 'collection',
          data: collectionsInCumulus,
          columns: tableColumnsCollections,
        },
        {
          id: 'cumulusGranules',
          name: 'Granules only in Cumulus',
          type: 'granule',
          data: granulesInCumulus,
          columns: tableColumnsGranules,
        },
        {
          id: 'cumulusFiles',
          name: 'Files only in Cumulus',
          type: 'file',
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
          type: 'collection',
          data: collectionsInCmr,
          columns: tableColumnsCollections,
        },
        {
          id: 'cmrGranules',
          name: 'Granules only in CMR',
          type: 'granule',
          data: granulesInCmr,
          columns: tableColumnsGranules,
        },
        {
          id: 'cmrFiles',
          name: 'Files only in CMR',
          type: 'file',
          data: granuleFilesOnlyInCmr,
          columns: tableColumnsFiles,
        },
      ],
    },
  ];

  return { internalComparison, cumulusVsCmrComparison, allBuckets };
};

export default reshapeReport;
