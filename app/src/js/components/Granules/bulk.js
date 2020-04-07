'use strict';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import { bulkGranule } from '../../actions';
import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
import _config from '../../config';
import TextArea from '../TextAreaForm/text-area';
import DefaultModal from '../Modal/modal';

const { kibanaRoot } = _config;

const defaultQuery = {
  workflowName: '',
  index: '',
  query: ''
};

const BulkGranule = ({
  history,
  dispatch,
  className,
  confirmAction,
  granules,
  element = 'button',
  selected
}) => {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState(JSON.stringify(defaultQuery, null, 2));
  const [errorState, setErrorState] = useState();
  const [requestId] = useState(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  const status = get(granules.bulk, [requestId, 'status']);
  const error = get(granules.bulk, [requestId, 'error']) || errorState;
  const asyncOpId = get(granules.bulk, [requestId, 'data', 'id']);
  const inflight = status === 'inflight';
  const success = status === 'success';
  const ButtonComponent = element;

  const buttonClass = `button button--small form-group__element button--green
    ${inflight ? ' button--loading' : ''}
    ${className ? ` ${className}` : ''}`;

  const elementClass = `async__element
    ${inflight ? ' async__element--loading' : ''}
    ${className ? ` ${className}` : ''}`;

  const buttonText = inflight ? 'loading...'
    : success ? 'Success!' : 'Run Bulk Granules';

  function handleCancel (e) {
    setShowModal(false);
  }

  function handleSubmit (e) {
    e.preventDefault();
    if (status !== 'inflight') {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkGranule({ requestId, json }));
    }
  }

  function handleClick (e) {
    e.preventDefault();
    if (confirmAction) {
      setShowModal(true);
    }
  }

  function onChange (id, value) {
    setQuery(value);
  }

  function handleSuccessConfirm (e) {
    e.preventDefault();
    history.push('/operations');
  }

  return (
    <>
      <ButtonComponent
        className={element === 'button' ? buttonClass : elementClass}
        onClick={handleClick}
      >
        <span>Run Bulk Granules{inflight && <Ellipsis />}</span>
      </ButtonComponent>
      <DefaultModal
        title='Bulk Granules'
        className='bulk_granules'
        showModal={showModal}
        cancelButtonText={success ? 'Close' : 'Cancel Bulk Granules'}
        confirmButtonText={success ? 'Go To Operations' : buttonText}
        confirmButtonClass='button__bulkgranules'
        onCancel={handleCancel}
        onCloseModal={handleCancel}
        onConfirm={success ? handleSuccessConfirm : handleSubmit}
      >
        {success &&
          <p>
            Your request to process a bulk granules operation has been submitted. <br/>
            ID <strong>{asyncOpId}</strong>
          </p>
        }
        {!success &&
          <>
            <h4 className="modal_subtitle">To run and complete your bulk granule task:</h4>
            <p>
                  1. In the box below, enter the <strong>workflowName</strong>. <br/>
                  2. Then add either an array of granule Ids or an elasticsearch query and index. <br/>
            </p>
            {selected &&
              <>
                <br/>
                <p>Currently selected granules are:</p>
                <p>[{selected.map(selection => `"${selection}"`).join(', ')}]</p>
              </>
            }
            <br/>
            <h4 className="modal_subtitle">If you need to construct a query</h4>
            <p>
                  To construct a query, go to Kibana and run a search. Then place the elasticsearch query in the operation input. <br/>
              <button className="button button__kibana_open button--small" href={kibanaRoot} alt="Open Kibana">Open Kibana</button>
            </p>
            <br/>
            <form>
              <TextArea
                value={query}
                id='run-bulk-granule'
                error={error}
                onChange={onChange}
                mode='json'
                minLines={30}
                maxLines={200}
              />
            </form>
          </>
        }
      </DefaultModal>
    </>
  );
};

BulkGranule.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  status: PropTypes.string,
  action: PropTypes.func,
  state: PropTypes.object,
  confirmAction: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string,
  granules: PropTypes.object,
  selected: PropTypes.array
};

export default withRouter(connect(state => ({
  granules: state.granules
}))(BulkGranule));
