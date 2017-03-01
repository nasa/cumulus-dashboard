'use strict';
import { encode } from '../utils/browser';

const singleCollectionRoutes = [
  ['Active', 'collection/:collectionName/active'],
  ['In-active', 'collection/:collectionName/inactive']
];

const collectionRoutes = [
  ['Back to Collections', null, 'sidebar__nav--back'],
  ['Overview', null],
  ['Granules', 'granules'],
  ['Ingest & Recipe', 'ingest'],
  ['Logs', 'logs']
];

const empty = [['', '']];

const collections = {
  base: 'collections',
  heading: 'Collections',
  routes: (currentRoute, params) => {
    // determine which set of routes to show, based on the current route
    if (currentRoute.indexOf('collections/collection') >= 0) {
      return singleCollectionRoutes.map(d => {
        // replace wildecards with params
        if (!d[1] || d[1].indexOf(':collectionName') === -1) { return d; }
        let copy = d.slice();
        copy[1] = encode(copy[1].replace(':collectionName', params.collectionName));
        return copy;
      });
    }
    else if (currentRoute.slice(0, 12) === '/collections') {
      return singleCollectionRoutes;
    }
    else {
      return empty;
    }
  }
};

export default collections;
