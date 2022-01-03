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
    label: 'Failed',
  },
];

export const granuleStatus = [
  ...status,
  {
    id: 'queued',
    label: 'Queued',
  },
];

export const operationStatus = [
  {
    id: 'RUNNING',
    label: 'Running',
  },
  {
    id: 'SUCCEEDED',
    label: 'Succeeded',
  },
  {
    id: 'TASK_FAILED',
    label: 'Task Failed',
  },
  {
    id: 'RUNNER_FAILED',
    label: 'Runner Failed',
  },
];

export const reconciliationReportStatus = [
  {
    id: 'Generated',
    label: 'Generated',
  },
  {
    id: 'Pending',
    label: 'Pending',
  },
  {
    id: 'Failed',
    label: 'Failed',
  },
];

export default status;
