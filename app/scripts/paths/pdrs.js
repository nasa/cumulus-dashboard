'use strict';

const pdrRoutes = [
  ['Overview', null],
  ['Active', 'active'],
  ['Errors', 'errors'],
  ['Completed', 'completed'],
  ['PDR', 'pdr']
];

const pdrs = {
  base: 'pdr',
  heading: 'PDRs',
  routes: () => pdrRoutes
};

export default pdrs;
