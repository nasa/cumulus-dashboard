import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import _config from '../../config';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';
import { clearGranulesWorkflows, getGranulesWorkflows } from '../../actions';
import SimpleDropdown from '../DropDown/simple-dropdown';

const { kibanaRoot } = _config;

const BulkGranuleModal = ({
  asyncOpId,
  bulkRequestAction,
  cancelButtonText,
  children,
  className,
  confirmButtonClass,
  confirmButtonText,
  defaultQuery,
  dispatch,
  error,
  granulesExecutions,
  handleSuccessConfirm,
  inflight,
  onCancel,
  queryWorkflowOptions = false,
  requestId,
  showModal,
  selected = [],
  selectWorkflow = false,
  success,
  successMessage,
  title,
}) => {
  const [query, setQuery] = useState(JSON.stringify(defaultQuery, null, 2));
  const [workflow, setWorkflow] = useState(null);
  const [errorState, setErrorState] = useState();
  let buttonText;

  if (inflight) {
    buttonText = 'loading...';
  } else if (success) {
    buttonText = 'Success!';
  } else {
    buttonText = confirmButtonText;
  }

  const formError = errorState || error;

  function handleSubmit (e) {
    e.preventDefault();
    let json;
    if (!inflight) {
      try {
        json = JSON.parse(query);
      } catch (jsonError) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkRequestAction({ requestId, json }));
    }
  }

  function onChange (id, value) {
    if (errorState) {
      try {
        JSON.parse(value);
        setErrorState();
      } catch (_) {
        // empty
      }
    }
    setQuery(value);
    if (queryWorkflowOptions) {
      dispatch(getGranulesWorkflows(query));
    }
  }

  function handleSelectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
    setQuery(JSON.stringify({ workflowName: selectedWorkflow, ...JSON.parse(query) }, null, 2));
  }

  useEffect(() => () => dispatch(clearGranulesWorkflows()), [dispatch]);

  return (
    <DefaultModal
      title={title}
      className={className}
      showModal={showModal}
      cancelButtonText={success ? 'Close' : cancelButtonText}
      confirmButtonText={success ? 'Go To Operations' : buttonText}
      confirmButtonClass={
        success
          ? 'button__goto'
          : confirmButtonClass
      }
      onCancel={onCancel}
      onCloseModal={onCancel}
      onConfirm={success ? handleSuccessConfirm : handleSubmit}
    >
      {success &&
        <div className="message__success">
          <p>
            { successMessage } <br/>
            ID <strong>{asyncOpId}</strong>
          </p>
        </div>
      }
      {!success &&
        <div className="form__bulkgranules">
          { children }
          <br/>
          <h4 className="modal_subtitle">If you need to construct a query in Kibana:</h4>
          <ol>
            <li>To construct a query, go to Kibana. &nbsp;
              <a className="button button__kibana_open button--small" href={kibanaRoot} alt="Open Kibana" target="_blank">Open Kibana</a>
            </li>
            <li>In Kibana, run a search and copy the query. </li>
            <li>Then paste the Elasticsearch query in the input below. </li>
          </ol>
          <br/>
          {selected &&
            <>
              <p>Selected granules:</p>
              <p>[{selected.map((selection) => `"${selection}"`).join(', ')}]</p>
            </>
          }
          <br/>
          <form>
            {window && <TextArea
              value={query}
              id={`run-bulk-granule-${requestId}`}
              error={formError}
              onChange={onChange}
              mode='json'
              minLines={30}
              maxLines={200}
            />}
          </form>
          {selectWorkflow &&
          <>
            <h4 className="modal_subtitle">Then select workflows to rerun for all the selected granules.</h4>
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
            <br/>
          </>
          }
        </div>
      }
    </DefaultModal>
  );
};

BulkGranuleModal.propTypes = {
  asyncOpId: PropTypes.string,
  bulkRequestAction: PropTypes.func,
  cancelButtonText: PropTypes.string,
  confirmButtonClass: PropTypes.string,
  confirmButtonText: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  defaultQuery: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.string,
  granulesExecutions: PropTypes.object,
  handleSuccessConfirm: PropTypes.func,
  inflight: PropTypes.bool,
  onCancel: PropTypes.func,
  // query workflow options for the granule from selection or es query
  queryWorkflowOptions: PropTypes.bool,
  requestId: PropTypes.string,
  selected: PropTypes.array,
  // whether select workflow
  selectWorkflow: PropTypes.bool,
  showModal: PropTypes.bool,
  success: PropTypes.bool,
  successMessage: PropTypes.string,
  title: PropTypes.string
};

export default connect((state) => ({
  granulesExecutions: state.granulesExecutions,
}))(BulkGranuleModal);
