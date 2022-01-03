import { encode } from '../utils/browser';
import { strings } from '../components/locale';

const collectionRoutes = [
  ['Overview', 'all']
];

const singleCollectionRoutes = [
  [strings.back_to_collections, null, 'sidebar__nav--back'],
  ['Overview', 'collection/:name/:version'],
  [strings.granules, 'collection/:name/:version/granules'],
  ['Completed', 'collection/:name/:version/granules/completed'],
  ['Running', 'collection/:name/:version/granules/processing'],
  ['Failed', 'collection/:name/:version/granules/failed'],
  ['Queued', 'collection/:name/:version/granules/queued'],
  ['Definition', 'collection/:name/:version/definition'],
  ['Logs', 'collection/:name/:version/logs']
];

const empty = [['', '']];

const collections = {
  base: 'collections',
  heading: strings.collections,
  routes: (currentRoute, params) => {
    // determine which set of routes to show, based on the current route
    if (/^\/collections\/[collection|edit]/.test(currentRoute)) {
      return singleCollectionRoutes.map((d) => {
        // replace wildcards with params
        if (!d[1] || !d[1].includes(':name')) { return d; }
        const copy = d.slice();
        copy[1] = encode(copy[1].replace(':name', params.name)
          .replace(':version', params.version));
        return copy;
      });
    }
    if (
      currentRoute.slice(0, 12) === '/collections') {
      return collectionRoutes;
    }
    return empty;
  }
};

export default collections;
