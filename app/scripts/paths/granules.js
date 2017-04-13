'use strict';
import { encode } from '../utils/browser';
import tally from './tally';
import { queryStatus } from '../utils/status';
const processing = queryStatus.filter(d => d !== 'failed' && d !== 'completed');

const granuleRoutes = [
  ['All Granules', null],
  ['Completed', 'completed', (d) => d.key === 'completed'],
  ['Processing', 'processing', (d) => processing.indexOf(d.key) >= 0],
  ['Failed', 'failed', (d) => d.key === 'failed']
];

const singleGranuleRoutes = [
  ['Back to Granules', null, 'sidebar__nav--back'],
  ['Overview', 'granule/:granuleId/overview'],
  ['Ingest & Recipe', 'granule/:granuleId/recipe-ingest']
];

const empty = [['', '']];

const granules = {
  base: 'granules',
  heading: 'Granules',
  routes: (currentRoute, params, count) => {
    if (currentRoute.indexOf('granules/granule') >= 0) {
      return singleGranuleRoutes.map(d => {
        if (!d[1] || d[1].indexOf(':granuleId') === -1) return d;
        let copy = d.slice();
        copy[1] = encode(copy[1].replace(':granuleId', params.granuleId));
        return copy;
      });
    } else if (currentRoute.slice(0, 9) === '/granules') {
      count = count || [];
      return granuleRoutes.map(d => tally(d, count));
    } else {
      return empty;
    }
  }
};

export default granules;
