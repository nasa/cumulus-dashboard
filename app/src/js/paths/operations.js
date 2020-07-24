'use strict';
const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Operations', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'operations',
  heading: 'Operations',
  routes: (currentRoute, params) => {
    if (currentRoute.includes('operations/operation')) {
      return singleRoutes;
    } else if (currentRoute.slice(0, 12) !== '/operations') {
      return empty;
    } else {
      return routes;
    }
  }
};

export default handler;
