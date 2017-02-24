'use strict';

const granuleRoutes = [
  ['Overview', null],
  ['All Granules', 'all'],
  ['Errors', 'errors'],
  ['Marked for Deletion', 'deletion'],
  ['Restricted', 'restricted']
];

const singleGranuleRoutes = [
  ['Granule', 'granule/:granuleId/overview'],
  ['Granule Ingest', 'granule/:granuleId/ingest']
];

const granules = {
  base: 'granules',
  heading: 'Granules',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('granules/granule') >= 0) {
      return singleGranuleRoutes;
    }
    return granuleRoutes;
  }
};

export default granules;
