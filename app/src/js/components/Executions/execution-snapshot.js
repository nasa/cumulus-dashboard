import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import SortableTable from '../SortableTable/SortableTable';
import { getExecutionStatus } from '../../actions';
import { formatEvents, subColumns } from '../../utils/table-config/executions';

const ExecutionSnapshot = ({
  dispatch,
  executionStatus,
  row,
}) => {
  const { original: { arn }, isExpanded } = row || {};
  const { map } = executionStatus || {};
  const currentExecutionStatus = useMemo(() => map[arn] || {}, [arn, map]);
  const { inflight, warning } = currentExecutionStatus || {};
  let error = get(currentExecutionStatus, 'error');
  let recordData = get(currentExecutionStatus, 'data.data', {});

  // record data is an error message
  if (typeof recordData === 'string' && recordData.startsWith('Error')) {
    const recordError = `${recordData}, please download the execution record instead`;
    error = error || recordError;
    recordData = {};
  }

  const { execution, executionHistory } = recordData;
  const { events } = executionHistory || {};
  const hasEvents = events?.length > 1;

  useEffect(() => {
    if (isExpanded && isEmpty(currentExecutionStatus)) {
      dispatch(getExecutionStatus(arn));
    }
  }, [dispatch, arn, isExpanded, currentExecutionStatus]);

  if (!inflight && !execution) return null;

  return (
    <>
      {inflight && <Alert variant='info'>Fetching snapshot...</Alert>}
      {(isExpanded && !inflight) &&
        <>
          {hasEvents &&
            <SortableTable
              className='sub-table'
              tableColumns={subColumns}
              data={formatEvents(events)}
              rowId='id'
              hideFilters={true}
            />}
          {warning && <Alert variant='warning'>{warning}</Alert>}
          {error && <Alert variant='error'>{error}</Alert>}
        </>
      }
    </>
  );
};

ExecutionSnapshot.propTypes = {
  dispatch: PropTypes.func,
  executionStatus: PropTypes.object,
  row: PropTypes.object
};

export default connect((state) => ({
  executionStatus: state.executionStatus,
}))(ExecutionSnapshot);
