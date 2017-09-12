'use strict';
import tally from './tally';

const providerRoutes = [
  ['All Providers', null]
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
