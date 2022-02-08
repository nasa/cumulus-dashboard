/**
 * Replace first character of each word of a string with a capitalized letter.
 * replaces lodash/startCase because it fails on `S3`
 * @param {string} sentence - input string to capitalize
 * @returns {string} input sentence with each first character capitalized.
 */
const startCase = (sentence) => sentence.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');

export default startCase;
