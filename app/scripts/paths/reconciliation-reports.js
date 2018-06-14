'use strict';
const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Reports List', null, 'sidebar__nav--back']
];

const handler = {
  base: 'reconciliation-reports',
  heading: 'Reconciliation Reports',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('reconciliation-reports/report') >= 0) {
      return singleRoutes;
    } else {
      return routes;
    }
  }
};

export default handler;
