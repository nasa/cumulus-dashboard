import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
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
  const { execution, executionHistory, inflight, warning, error } = currentExecutionStatus || {};
  const { events } = executionHistory || {};
  const hasEvents = events?.length > 1;

  useEffect(() => {
    if (isExpanded && !currentExecutionStatus) {
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
  executionStatus: PropTypes.shape({
    executionHistory: PropTypes.shape({
      events: PropTypes.array
    })
  }),
  row: PropTypes.object
};

export default connect((state) => ({
  executionStatus: state.executionStatus,
}))(ExecutionSnapshot);
