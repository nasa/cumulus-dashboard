const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Reports List', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'reconciliation-reports',
  heading: 'Reconciliation Reports',
  routes: (currentRoute, params) => {
    if (currentRoute.includes('reconciliation-reports/report')) {
      return singleRoutes;
    }

    if (!currentRoute.includes('reconciliation-reports')) {
      return empty;
    }

    return routes;
  }
};

export default handler;
