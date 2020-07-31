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
  routes: (currentRoute, params, count = []) => {
    if (currentRoute.includes('/providers/provider')) {
      return singleProviderRoutes;
    }

    if (currentRoute.slice(0, 10) !== '/providers') {
      return empty;
    }

    return providerRoutes.map((d) => tally(d, count));
  }
};

export default providers;
