import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
  const currentExecutionStatus = map ? map[arn] : {};
  const { execution, executionHistory, inflight } = currentExecutionStatus || {};
  const { events } = executionHistory || {};

  useEffect(() => {
    if (isExpanded) {
      dispatch(getExecutionStatus(arn));
    }
  }, [dispatch, arn, isExpanded]);

  if (!inflight && !execution) return null;

  return (
    <>
      {inflight && 'Fetching snapshot...'}
      {(isExpanded && !inflight) &&
       <SortableTable
         tableColumns={subColumns}
         data={formatEvents(events)}
         rowId='id'
         hideFilters={true}
       />
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
