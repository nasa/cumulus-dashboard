'use strict';

import searchConcept from './searchConcept';

/**
 * A class to simplify requests to the CMR
 */
class CMR {
  /**
   * The constructor for the CMR class
   *
   * @param {Object} params
   * @param {string} params.provider - the CMR provider id
   * @param {string} params.clientId - the CMR clientId
   * @param {string} params.cmrEnvironment - CMR environment to
   *              use valid arguments are ['OPS', 'SIT', 'UAT']
   */
  constructor(params = {}) {
    this.provider = params.provider;
    this.clientId = params.clientId;
    this.cmrEnvironment = params.cmrEnvironment;
  }

  /**
   * Return object containing CMR request headers for GETs
   *
   * @param {Object} params
   * @param {string} [params.token] - CMR request token
   * @returns {Object} CMR headers object
   */
  getReadHeaders(params = {}) {
    const headers = {
      'Client-Id': this.clientId
    };

    if (params.token) headers['Echo-Token'] = params.token;

    return headers;
  }

  /**
   * Search in collections
   *
   * @param {string} params - the search parameters
   * @param {string} [format=json] - format of the response
   * @returns {Promise.<Object>} the CMR response
   */
  searchCollections(params, format = 'json') {
    const headers = this.getReadHeaders();
    const searchParams = { provider_short_name: this.provider, ...params };
    return searchConcept({
      type: 'collections',
      searchParams,
      previousResults: [],
      headers,
      format,
      recursive: true,
      cmrEnvironment: this.cmrEnvironment
    });
  }
}

export default CMR;
