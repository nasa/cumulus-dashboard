'use strict';
import { encode } from '../utils/browser';

const collectionRoutes = [
  ['All Collections', 'all']
];

const singleCollectionRoutes = [
  ['Back to Collections', null, 'sidebar__nav--back'],
  ['Overview', 'collection/:collectionName/:collectionVersion'],
  ['Granules', 'collection/:collectionName/:collectionVersion/granules'],
  ['Definition', 'collection/:collectionName/:collectionVersion/definition'],
  ['Logs', 'collection/:collectionName/:collectionVersion/logs']
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
        if (!d[1] || d[1].indexOf(':collectionName') === -1) { return d; }
        let copy = d.slice();
        copy[1] = encode(copy[1].replace(':collectionName', params.collectionName)
                                .replace(':collectionVersion', params.collectionVersion));
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
