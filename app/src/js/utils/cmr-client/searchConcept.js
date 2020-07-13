'use strict';

import axios from 'axios';
import { promisify } from 'util';
import xml2js from 'xml2js';

import getUrl from './getUrl';

async function parseXMLString(xmlString) {
  const parseString = promisify(xml2js.parseString);
  const xmlParseOptions = {
    ignoreAttrs: true,
    mergeAttrs: true,
    explicitArray: false
  };

  return parseString(xmlString, xmlParseOptions);
}

/**
 *
 * @param {Object} params
 * @param {string} params.type - Concept type to search, choices: ['collections', 'granules']
 * @param {string} params.cmrEnvironment - optional, CMR environment to
 *              use valid arguments are ['OPS', 'SIT', 'UAT']
 * @param {Object} params.searchParams - CMR search parameters
 * Note initial searchParams.page_num should only be set if recursive is false
 * @param {Array} [params.previousResults=[]] - array of results returned in previous recursive
 * calls to be included in the results returned
 * @param {Object} [params.headers={}] - the CMR headers
 * @param {string} [params.format] - format of the response, supports umm_json, json, echo10
 * @param {boolean} [params.recursive] - indicate whether search recursively to get all the result
 * @param {number} params.cmrLimit - the CMR limit
 * @param {number} params.cmrPageSize - the CMR page size
 * @returns {Promise.<Array>} - array of search results.
 */
async function searchConcept({
  type,
  searchParams,
  previousResults = [],
  headers = {},
  format = 'json',
  recursive = true,
  cmrEnvironment,
  cmrLimit = process.env.CMR_LIMIT,
  cmrPageSize = process.env.CMR_PAGE_SIZE
}) {
  const recordsLimit = cmrLimit || 100;
  const pageSize = searchParams.pageSize || cmrPageSize || 50;

  const defaultParams = { page_size: pageSize };

  const url = `${getUrl('search', null, cmrEnvironment)}${type}.${format.toLowerCase()}`;

  const pageNum = (searchParams.page_num) ? searchParams.page_num + 1 : 1;

  // if requested, recursively retrieve all the search results for collections or granules
  const query = { ...defaultParams, ...searchParams, page_num: pageNum };
  // const response = await got.get(url, { json: format.endsWith('json'), query, headers });
  const response = await axios.get(url, { params: query, headers });

  const responseItems = (format === 'echo10')
    ? (await parseXMLString(response.data)).results.result || []
    : (response.data.items || response.data.feed.entry);

  const fetchedResults = previousResults.concat(responseItems || []);

  const numRecordsCollected = fetchedResults.length;
  const CMRHasMoreResults = response.headers['cmr-hits'] > numRecordsCollected;
  const recordsLimitReached = numRecordsCollected >= recordsLimit;
  if (recursive && CMRHasMoreResults && !recordsLimitReached) {
    return searchConcept({
      type,
      searchParams: query,
      previousResults: fetchedResults,
      headers,
      format,
      recursive,
      cmrEnvironment,
      cmrLimit,
      cmrPageSize
    });
  }
  return fetchedResults.slice(0, recordsLimit);
}

export default searchConcept;
