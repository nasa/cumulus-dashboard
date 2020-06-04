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

const getGranuleFilesSummary = ({ onlyInCumulus = [], onlyInCmr = [] }) => {
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

export const reshapeReport = (record) => {
  let filesInS3 = [];
  let filesInDynamoDb = [];

  let granuleFilesOnlyInCumulus = [];
  let granuleFilesOnlyInCmr = [];

  let collectionsInCumulus = [];
  let collectionsInCmr = [];

  let granulesInCumulus = [];
  let granulesInCmr = [];

  if (record.data) {
    const {
      filesInCumulus: internalCompareFiles = {},
      filesInCumulusCmr: compareFiles = {},
      collectionsInCumulusCmr: compareCollections = {},
      granulesInCumulusCmr: compareGranules = {},
    } = record.data;

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
  const cardConfig = [
    {
      id: 'dynamo',
      name: 'DynamoDB',
      tables: [
        {
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
          name: 'Files in S3 not found in DynamoDb',
          data: filesInS3,
          columns: tableColumnsS3Files,
        },
      ],
    },
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

  return cardConfig;
};
