'use strict';

const singleCollectionRoutes = [
  ['Back to Collections', null, 'sidebar__nav--back'],
  ['Active', 'active'],
  ['In-active', 'inactive']
];

const collectionRoutes = [
  ['Overview', null],
  ['Granules', 'granules'],
  ['Errors', 'errors'],
  ['Ingest & Recipe', 'ingest'],
  ['Logs', 'logs']
];

const collections = {
  base: 'collections',
  heading: 'Collections',
  routes: (params) => {
    return collectionRoutes;
  }
};

export default collections;
