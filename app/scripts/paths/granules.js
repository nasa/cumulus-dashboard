'use strict';
import { encode } from '../utils/browser';

const granuleRoutes = [
  ['Overview', null],
  ['Marked for Deletion', 'deletion'],
  ['Restricted', 'restricted']
];

const singleGranuleRoutes = [
  ['Overview', 'granule/:granuleId/overview'],
  ['Ingest & Recipe', 'granule/:granuleId/recipe-ingest']
];

const empty = [['', '']];

const granules = {
  base: 'granules',
  heading: 'Granules',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('granules/granule') >= 0) {
      return singleGranuleRoutes.map(d => {
        if (!d[1] || d[1].indexOf(':granuleId') === -1) { return d; }
        let copy = d.slice();
        copy[1] = encode(copy[1].replace(':granuleId', params.granuleId));
        return copy;
      });
    }
    else if (currentRoute.slice(0, 9) === '/granules') {
      return granuleRoutes;
    }
    else {
      return empty;
    }
  }
};

export default granules;
