'use strict';
import tally from './tally';

const providerRoutes = [
  ['Overview', null],
  ['All Providers', 'all'],
  ['Active', 'active', (d) => d.key === 'ingesting'],
  ['Inactive', 'inactive', (d) => d.key === 'stopped'],
  ['Failed', 'failed', (d) => d.key === 'failed']
];

const EMPTY = [['', '']];

const providers = {
  base: 'providers',
  heading: 'Providers',
  routes: (currentRoute, params, count) => {
    if (currentRoute.startsWith('/providers')) {
      count = count || [];
      return providerRoutes.map(d => tally(d, count));
    } else {
      return EMPTY;
    }
  }
};

export default providers;
