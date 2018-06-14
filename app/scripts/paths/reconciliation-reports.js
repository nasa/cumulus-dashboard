'use strict';
const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Reports', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'reconciliation-reports',
  heading: 'Reconciliation Reports',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('reconciliation-reports/report') >= 0) {
      return singleRoutes;
    } else if (currentRoute.slice(0, 11) !== '/reconciliation-reports') {
      return empty;
    } else {
      return routes;
    }
  }
};

export default handler;
