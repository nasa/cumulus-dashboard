'use strict';

const granuleRoutes = [
  ['Overview', null],
  ['Marked for Deletion', 'deletion'],
  ['Restricted', 'restricted']
];

const singleGranuleRoutes = [
  ['Overview', null],
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
