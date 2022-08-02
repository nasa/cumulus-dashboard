export const getGranuleRecoveryJobStatusFromRecord = (record) => {
  if (!record) return undefined;
  const jobStatuses = (record.files || []).map((file) => file.status);
  // file status may be 'pending', 'staged', 'success', or 'failed'
  let recoveryStatus = 'failed';
  if (jobStatuses.length === 0) {
    recoveryStatus = undefined;
  } else if (jobStatuses.filter((jobStatus) => jobStatus !== 'success').length === 0) {
    recoveryStatus = 'completed';
  } else if (jobStatuses.filter((jobStatus) => !['success', 'failed'].includes(jobStatus)).length > 0) {
    recoveryStatus = 'running';
  }
  return recoveryStatus;
};

export default getGranuleRecoveryJobStatusFromRecord;
