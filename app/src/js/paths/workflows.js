const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Workflows', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'workflows',
  heading: 'Workflows',
  routes: (currentRoute, params) => {
    if (currentRoute.includes('workflows/workflow')) {
      return singleRoutes;
    }

    if (currentRoute.slice(0, 11) !== '/workflows') {
      return empty;
    }

    return routes;
  }
};

export default handler;
