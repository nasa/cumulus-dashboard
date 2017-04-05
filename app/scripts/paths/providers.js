'use strict';

const providerRoutes = [
  ['Overview', null],
  ['Active', 'active'],
  ['Inactive', 'inactive'],
  ['Failed', 'failed']
];

const EMPTY = [['', '']];

const providers = {
  base: 'providers',
  heading: 'Providers',
  routes: (currentRoute) => {
    if (currentRoute.startsWith('/providers')) {
      return providerRoutes;
    } else {
      return EMPTY;
    }
  }
};

export default providers;
