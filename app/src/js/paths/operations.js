import { encode } from '../utils/browser';

const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Operations', null, 'sidebar__nav--back'],
  ['Details', 'operation/:operationId']
];

const empty = [['', '']];

const handler = {
  base: 'operations',
  heading: 'Operations',
  routes: (currentRoute, params) => {
    if (currentRoute.includes('operations/operation/')) {
      return singleRoutes.map((d) => {
        if (!d[1] || !d[1].includes(':operationId')) { return d; }
        const copy = d.slice();
        copy[1] = encode(copy[1].replace(':operationId', params.operationId));
        return copy;
      });
    }

    if (currentRoute.slice(0, 12) !== '/operations') {
      return empty;
    }

    return routes;
  }
};

export default handler;
