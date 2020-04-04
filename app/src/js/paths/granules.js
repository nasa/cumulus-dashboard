'use strict';
import { encode } from '../utils/browser';
import tally from './tally';
import { strings } from '../components/locale';

const granuleRoutes = [
  ['Overview', null],
  ['Completed', 'completed', (d) => d.key === 'completed'],
  ['Running', 'processing', (d) => d.key === 'running'],
  ['Failed', 'failed', (d) => d.key === 'failed']
];

const singleGranuleRoutes = [
  [strings.back_to_granules, null, 'sidebar__nav--back']
];

const empty = [['', '']];

const granules = {
  base: 'granules',
  heading: strings.granules,
  routes: (currentRoute, params, count) => {
    if (currentRoute.indexOf('granules/granule') >= 0) {
      return singleGranuleRoutes.map(d => {
        if (!d[1] || d[1].indexOf(':granuleId') === -1) return d;
        const copy = d.slice();
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
