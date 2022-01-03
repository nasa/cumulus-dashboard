import { encode } from '../utils/browser';
import tally from './tally';
import { strings } from '../components/locale';

const granuleRoutes = [
  ['Overview', null],
  ['Completed', 'completed', (d) => d.key === 'completed'],
  ['Running', 'processing', (d) => d.key === 'running'],
  ['Failed', 'failed', (d) => d.key === 'failed'],
  ['Queued', 'queued', (d) => d.key === 'queued'],
  ['Lists', 'lists', (d) => d.key === 'Granule Inventory']
];

const singleGranuleRoutes = [
  [strings.back_to_granules, null, 'sidebar__nav--back']
];

const empty = [['', '']];

const granules = {
  base: 'granules',
  heading: strings.granules,
  routes: (currentRoute, params, count = []) => {
    if (currentRoute.includes('granules/granule')) {
      return singleGranuleRoutes.map((d) => {
        if (!d[1] || !d[1].includes(':granuleId')) return d;
        const copy = d.slice();
        copy[1] = encode(copy[1].replace(':granuleId', params.granuleId));
        return copy;
      });
    }
    if (currentRoute.slice(0, 9) === '/granules') {
      return granuleRoutes.map((d) => tally(d, count));
    }

    return empty;
  }
};

export default granules;
