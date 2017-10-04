'use strict';
const status = {
  Running: 'running',
  Completed: 'completed',
  Failed: 'failed'
};
export default status;

export const queryStatus = [
  'running',
  'completed',
  'failed'
];

export const pdrStatus = {
  Discovered: 'discovered',
  Parsed: 'parsed',
  Completed: 'completed',
  Failed: 'failed'
};

export const pdrQueryStatus = [
  'discovered',
  'parsed',
  'completed',
  'failed'
];
