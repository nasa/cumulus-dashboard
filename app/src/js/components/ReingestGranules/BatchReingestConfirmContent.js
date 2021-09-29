import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { get } from 'object-path';

import {
  clearGranulesWorkflows,
  getGranulesWorkflows,
  getGranulesWorkflowsClearError
} from '../../actions';
import ErrorReport from '../Errors/report';
import SimpleDropdown from '../DropDown/simple-dropdown';

export const maxDisplayed = 10;

const BatchReingestConfirmContent = ({
  onChange,
  selected = [],
  dispatch,
  granulesExecutions,
}) => {
  const [workflow, setWorkflow] = useState(null);
  const isMultiple = selected.length > 1;
  const s = isMultiple ? 's' : '';
  const requestText = `Selected granule${s}:`;

  const displayedItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(selected.length, maxDisplayed); i++) {
      items.push(<li key={i}>{selected[i].granuleId}</li>);
    }
    if (selected.length > maxDisplayed) {
      items.push(<li key={maxDisplayed}>and {selected.length - maxDisplayed} more.</li>);
    }
    return items;
  };

  useEffect(() => {
    dispatch(getGranulesWorkflows({ granules: selected }));
    setWorkflow(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selected)]);

  useEffect(() => () => {
    dispatch(clearGranulesWorkflows());
    dispatch(getGranulesWorkflowsClearError());
  }, [dispatch]);

  function handleSelectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
    if (typeof onChange === 'function') {
      onChange({ workflowName: selectedWorkflow });
    }
  }

  return (
    <>
      <Alert variant='primary'><strong>Attention:</strong> {`The selected granule${s} will be overwritten`}</Alert>
      {requestText}
      <ul>
        {displayedItems()}
      </ul>
      <div className="batch_granules--reingest">
        <h4 className="modal_subtitle">{`To complete your granule reingest request${s}:`}</h4>
        <p>
          {`Below you can select a specific workflow to apply to the selected granule${s}. `}
          <strong>Note: The default is the latest workflow.</strong>
        </p>
        {get(granulesExecutions, 'workflows.error') &&
          <ErrorReport report={`Failed to get workflows: ${get(granulesExecutions, 'workflows.error')}`}/>}
      </div>
      <div>
        <SimpleDropdown
          isClearable={true}
          key={'workflow-dropdown'}
          label={'Select Workflow'}
          value={workflow}
          options={granulesExecutions.workflows.data}
          id='workflow-dropdown'
          onChange={handleSelectWorkflow}
          placeholder="Workflow Name"
        />
      </div>
    </>
  );
};

BatchReingestConfirmContent.propTypes = {
  onChange: PropTypes.func,
  granulesExecutions: PropTypes.object,
  dispatch: PropTypes.func,
  selected: PropTypes.arrayOf(PropTypes.shape({
    granuleId: PropTypes.string,
    collectionId: PropTypes.string,
  })),
};

export { BatchReingestConfirmContent };

export default connect((state) => ({
  granulesExecutions: state.granulesExecutions,
}))(BatchReingestConfirmContent);
