const path = require('path');

/**
 *
 * @param {any} searchType
 * @param {any} prefix
 * @returns
 */
const searchIndex = (searchType, prefix) => {
  const searchIndices = {
    DistApiGateway: `${prefix}-cloudwatch*`,
    DistApiLambda: `${prefix}-cloudwatch*`,
    TEALambda: `${prefix}-cloudwatch*`,
    DistS3Access: `${prefix}-s3*`,
  };
  const suffix = '_search/';

  const boundedIndex = searchIndices[searchType] || '';
  return path.join(boundedIndex, suffix);
};

export default searchIndex;
