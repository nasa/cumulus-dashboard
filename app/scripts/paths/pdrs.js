'use strict';

const pdrRoutes = [
  ['Overview', null],
  ['Active', 'active'],
  ['Errors', 'errors'],
  ['Completed', 'completed'],
  ['PDR', 'pdr']
];

const empty = [['', '']];

const pdrs = {
  base: 'pdrs',
  heading: 'PDRs',
  routes: (currentRoute) => {
    if (currentRoute.slice(0, 5) !== '/pdrs') {
      return empty;
    } else {
      return pdrRoutes;
    }
  }
};

export default pdrs;
