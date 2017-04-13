'use strict';
const status = {
  '': '',
  Ingesting: 'ingesting',
  Processing: 'processing',
  'Updating CMR': 'cmr',
  Archiving: 'archiving',
  Completed: 'completed',
  Stopped: 'stopped',
  Failed: 'failed'
};
export default status;

export const queryStatus = [
  'discovered',
  'ingesting',
  'processing',
  'cmr',
  'archiving',
  'completed',
  'stopped',
  'failed'
];

export const pdrStatus = {
  '': '',
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
