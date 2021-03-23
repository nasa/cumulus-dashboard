/* eslint-disable prefer-spread */
/* eslint-disable prefer-rest-params */
export default function log () {
  console.log.apply(console, arguments);
}

export const metricsNotConfiguredMessage = 'Metrics not configured';
