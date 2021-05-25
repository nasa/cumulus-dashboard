const path = require('path');

/**
 *
 * @param {string} indexPattern - Metrics ES index pattern to prefix your search URI
 * @returns {string} correct index search string for searching metrics.
 */
const searchIndex = (indexPattern) => path.join(indexPattern, '_search/');

export default searchIndex;
