'use strict';

const granuleRoutes = [
  ['Overview', null],
  ['All Granules', 'all-granules'],
  ['Errors', 'errors'],
  ['Marked for Deletion', 'marked-deletion'],
  ['Restricted', 'restricted']
];

const singleGranuleRoutes = [
  ['Granule', ':granuleId/overview'],
  ['Granule Ingest', ':granuleId/ingest']
];

const granules = {
  base: 'granules',
  heading: 'Granules',
  routes: (params) => {
    return granuleRoutes;
  }
};

export default granules;
