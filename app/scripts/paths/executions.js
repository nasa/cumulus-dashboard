'use strict';
const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Executions', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'executions',
  heading: 'Executions',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('executions/execution') >= 0) {
      return singleRoutes;
    } else if (currentRoute.slice(0, 12) !== '/executions') {
      return empty;
    } else {
      return routes;
    }
  }
};

export default handler;
