import { get } from 'object-path';
import { tally } from '../utils/format';
function tallyFn (route, count) {
  // check for a filter function
  const filter = route[2];
  if (typeof filter !== 'function') return route;

  // filter
  const matches = count.filter(filter);
  if (!matches.length) return route;

  // reduce
  const value = matches.reduce((a, b) => a + get(b, 'count', 0), 0);

  // clone and set the tally
  const copy = route.slice();
  copy[0] += ` ${tally(value)}`;
  return copy;
}
export default tallyFn;
