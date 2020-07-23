'use strict';
const status = [
  {
    id: 'running',
    label: 'Running',
  },
  {
    id: 'completed',
    label: 'Completed',
  },
  {
    id: 'failed',
    label: 'Failed'
  }
];
export default status;

export const operationStatus = [
  {
    id: 'RUNNING',
    label: 'Running'
  },
  {
    id: 'SUCCEEDED',
    label: 'Succeeded'
  },
  {
    id: 'TASK_FAILED',
    label: 'Task Failed'
  },
  {
    id: 'RUNNER_FAILED',
    label: 'Runner Failed'
  }
];

export const pdrStatus = {
  Discovered: 'discovered',
  Parsed: 'parsed',
  Completed: 'completed',
  Failed: 'failed'
};

export const reconciliationReportStatus = [
  {
    id: 'Generated',
    label: 'Generated'
  },
  {
    id: 'Pending',
    label: 'Pending'
  },
  {
    id: 'Failed',
    label: 'Failed'
  }
];
