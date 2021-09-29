import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'object-path';

import _config from '../../config';
import DefaultModal from '../Modal/modal';
import ErrorReport from '../Errors/report';
import SimpleDropdown from '../DropDown/simple-dropdown';
import TextArea from '../TextAreaForm/text-area';
import {
  clearGranulesWorkflows,
  getGranulesWorkflows,
  getGranulesWorkflowsClearError
} from '../../actions';

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
        const granuleIds = json.ids.map((granule) => granule.granuleId);
        json.ids = granuleIds;
      } catch (jsonError) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkRequestAction({ requestId, json }));
    }
  }

  function queryGranulesWorkflows(queryParams) {
    const { ids, index, query: esQuery } = queryParams;
    if ((index && esQuery) || ids.length > 0) {
      const granuleWorkflowsQuery = { ...queryParams, granules: ids };
      delete granuleWorkflowsQuery[ids];
      dispatch(getGranulesWorkflows(granuleWorkflowsQuery));
    }
  }

  function onChange (id, value) {
    setQuery(value);
    try {
      const queryParams = JSON.parse(value);
      if (errorState) {
        setErrorState();
      }
      if (queryWorkflowOptions) {
        queryGranulesWorkflows(queryParams);
      }
    } catch (_) {
      // empty
    }
  }

  function handleSelectWorkflow(selector, selectedWorkflow) {
    setWorkflow(selectedWorkflow);
    setQuery(JSON.stringify({ workflowName: selectedWorkflow, ...JSON.parse(query) }, null, 2));
  }

  useEffect(() => {
    const queryParams = { ...JSON.parse(query), ids: selected };
    setQuery(JSON.stringify(queryParams, null, 2));

    if (showModal && queryWorkflowOptions) {
      queryGranulesWorkflows(queryParams);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, showModal, queryWorkflowOptions, JSON.stringify(selected)]);

  useEffect(() => {
    if (!showModal && queryWorkflowOptions) {
      dispatch(clearGranulesWorkflows());
      dispatch(getGranulesWorkflowsClearError());
      setWorkflow(null);
    }
  }, [dispatch, showModal, queryWorkflowOptions]);

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
      size = "xl"
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
              <p>[{selected.map((selection) => `"${selection.granuleId}"`).join(', ')}]</p>
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
            <h4 className="modal_subtitle">Then select workflow to rerun for all the selected granules.</h4>
            {get(granulesExecutions, 'workflows.error') &&
              <ErrorReport report={`Failed to get workflows: ${get(granulesExecutions, 'workflows.error')}`}/>}
            <div className='modal__internal modal__formcenter'>
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
  // whether query workflow options for the selected granule
  queryWorkflowOptions: PropTypes.bool,
  requestId: PropTypes.string,
  selected: PropTypes.arrayOf(PropTypes.shape({
    granuleId: PropTypes.string,
    collectionId: PropTypes.string,
  })),
  // whether select a workflow from dropdown
  selectWorkflow: PropTypes.bool,
  showModal: PropTypes.bool,
  success: PropTypes.bool,
  successMessage: PropTypes.string,
  title: PropTypes.string
};

export { BulkGranuleModal };

export default connect((state) => ({
  granulesExecutions: state.granulesExecutions,
}))(BulkGranuleModal);
