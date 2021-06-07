const path = require('path');

/**
 *
 * @param {string} targetPattern - Metrics ES target pattern to prefix your search URI
 * @returns {string} correct index search string for searching metrics.
 */
const searchTarget = (targetPattern) => path.join(targetPattern, '_search/');

export default searchTarget;
