'use strict';
import { encode } from '../utils/browser';

const collectionRoutes = [
  ['All Collections', 'all']
];

const singleCollectionRoutes = [
  ['Back to Collections', null, 'sidebar__nav--back'],
  ['Overview', 'collection/:name/:version'],
  ['Granules', 'collection/:name/:version/granules'],
  ['Definition', 'collection/:name/:version/definition'],
  ['Logs', 'collection/:name/:version/logs']
];

const empty = [['', '']];

const collections = {
  base: 'collections',
  heading: 'Collections',
  routes: (currentRoute, params) => {
    // determine which set of routes to show, based on the current route
    if (/^\/collections\/[collection|edit]/.test(currentRoute)) {
      return singleCollectionRoutes.map(d => {
        // replace wildecards with params
        if (!d[1] || d[1].indexOf(':name') === -1) { return d; }
        let copy = d.slice();
        copy[1] = encode(copy[1].replace(':name', params.name)
                                .replace(':version', params.version));
        return copy;
      });
    } else if (
      currentRoute.slice(0, 12) === '/collections') {
      return collectionRoutes;
    } else {
      return empty;
    }
  }
};

export default collections;
