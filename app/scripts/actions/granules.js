import url from 'url';

import _config from '../config';
import { CALL_API, GRANULES } from './types';

const root = _config.apiRoot;
const { pageLimit } = _config;

export const listGranules = (options) => ({
  [CALL_API]: {
    type: GRANULES,
    method: 'GET',
    id: null,
    url: url.resolve(root, 'granules'),
    qs: Object.assign({ limit: pageLimit }, options)
  }
});
