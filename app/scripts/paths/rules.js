'use strict';
const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Rules', null, 'sidebar__nav--back']
];

const empty = [['', '']];

const handler = {
  base: 'rules',
  heading: 'Rules',
  routes: (currentRoute, params) => {
    if (/^\/rules\/[rule|edit]/.test(currentRoute)) {
      return singleRoutes;
    } else if (currentRoute.slice(0, 6) === '/rules') {
      return routes;
    } else {
      return empty;
    }
  }
};

export default handler;
