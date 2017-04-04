'use strict';

const pdrRoutes = [
  ['Overview', null],
  ['Completed', 'completed'],
  ['Active', 'active'],
  ['Failed', 'failed']
];

const singlePdrRoutes = [
  ['Back to PDRs', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const pdrs = {
  base: 'pdrs',
  heading: 'PDRs',
  routes: (currentRoute) => {
    if (currentRoute.indexOf('pdrs/pdr') >= 0) {
      return singlePdrRoutes;
    } else if (currentRoute.slice(0, 5) !== '/pdrs') {
      return empty;
    } else {
      return pdrRoutes;
    }
  }
};

export default pdrs;
