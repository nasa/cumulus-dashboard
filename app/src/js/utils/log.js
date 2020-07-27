/* eslint-disable prefer-rest-params */
export default function log () {
  // eslint-disable-next-line prefer-spread
  console.log.apply(console, arguments);
}
