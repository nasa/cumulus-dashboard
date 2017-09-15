'use strict';
import tally from './tally';

const providerRoutes = [
  ['Overview', null]
];

const singleProviderRoutes = [
  ['Back to Providers', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const providers = {
  base: 'providers',
  heading: 'Providers',
  routes: (currentRoute, params, count) => {
    if (currentRoute.indexOf('/providers/provider') >= 0) {
      return singleProviderRoutes;
    } else if (currentRoute.slice(0, 10) !== '/providers') {
      return empty;
    } else {
      count = count || [];
      return providerRoutes.map(d => tally(d, count));
    }
  }
};

export default providers;
