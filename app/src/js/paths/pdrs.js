import tally from './tally';

const pdrRoutes = [
  ['Overview', null],
  ['Completed', 'completed', (d) => d.key === 'completed'],
  ['Active', 'active', (d) => d.key === 'running'],
  ['Failed', 'failed', (d) => d.key === 'failed']
];

const singlePdrRoutes = [
  ['Back to PDRs', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const pdrs = {
  base: 'pdrs',
  heading: 'PDRs',
  routes: (currentRoute, params, count = []) => {
    if (currentRoute.includes('pdrs/pdr')) {
      return singlePdrRoutes;
    }
    if (currentRoute.slice(0, 5) !== '/pdrs') {
      return empty;
    }

    return pdrRoutes.map((d) => tally(d, count));
  }
};

export default pdrs;
