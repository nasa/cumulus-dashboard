import deepmerge from 'deepmerge';

// don't try to merge arrays.
const arrayMerge = (destination, source) => source;
const options = { arrayMerge };
const merge = (x, y) => deepmerge(x, y, options);
export default merge;
