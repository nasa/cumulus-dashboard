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
    if (currentRoute.indexOf('rules/rule') >= 0) {
      return singleRoutes;
    } else if (currentRoute.slice(0, 7) !== '/rules') {
      return empty;
    } else {
      return routes;
    }
  }
};

export default handler;
