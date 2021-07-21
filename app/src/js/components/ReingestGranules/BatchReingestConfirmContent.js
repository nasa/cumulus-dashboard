import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { clearGranulesWorkflows, getGranulesWorkflows } from '../../actions';
import SimpleDropdown from '../DropDown/simple-dropdown';

export const maxDisplayed = 10;

const BatchReingestConfirmContent = ({
  onChange,
  selected = [],
  dispatch,
  granulesExecutions,
}) => {
  // TODO if no workflow found
  const [workflow, setWorkflow] = useState(null);
  const isMultiple = selected.length > 1;
  const s = isMultiple ? 's' : '';
  const requestText = `Selected granule${s}:`;

  const displayedItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(selected.length, maxDisplayed); i++) {
      items.push(<li key={i}>{selected[i]}</li>);
    }
    if (selected.length > maxDisplayed) {
      items.push(<li key={maxDisplayed}>and {selected.length - maxDisplayed} more.</li>);
    }
    return items;
  };

  useEffect(() => {
    dispatch(getGranulesWorkflows(JSON.stringify({ ids: selected })));
    return () => {
      dispatch(clearGranulesWorkflows());
    };
  }, [dispatch, selected]);

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
      To complete your granule reingest requests:
      <br></br>
      {`Below you can select a specific workflow to apply to the selected granule${s}. `}
      <strong>Note: The default is the latest workflow.</strong>

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
  selected: PropTypes.array,
};

export default connect((state) => ({
  granulesExecutions: state.granulesExecutions,
}))(BatchReingestConfirmContent);
