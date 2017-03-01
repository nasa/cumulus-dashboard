'use strict';

const pdrRoutes = [
  ['Overview', null],
  ['Active', 'active'],
  ['Completed', 'completed'],
  ['PDR', 'pdr']
];

const pdrs = {
  base: 'pdrs',
  heading: 'PDRs',
  routes: () => pdrRoutes
};

export default pdrs;
