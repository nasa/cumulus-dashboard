'use strict';
import { encode } from '../utils/browser';
// import executions from "../reducers/executions";

const routes = [
  ['Overview', null]
];

const singleRoutes = [
  ['Back to Executions', null, 'sidebar__nav--back'],
  ['Details', 'execution/:executionArn'],
  ['Events', 'execution/:executionArn/events'],
  ['Logs', 'execution/:executionArn/logs']
];

const empty = [['', '']];

const handler = {
  base: 'executions',
  heading: 'Executions',
  routes: (currentRoute, params) => {
    if (currentRoute.indexOf('executions/execution') >= 0) {
      return singleRoutes.map(d => {
        if (!d[1] || d[1].indexOf(':executionArn') === -1) { return d; }
        const copy = d.slice();
        copy[1] = encode(copy[1].replace(':executionArn', params.executionArn));
        return copy;
      });
    } else if (currentRoute.slice(0, 12) !== '/executions') {
      return empty;
    } else {
      return routes;
    }
  }
};

export default handler;
