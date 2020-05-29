import React, { useState } from 'react';
import { get } from 'object-path';
import PropTypes from 'prop-types';

import { bulkGranuleDelete } from '../../actions';
import _config from '../../config';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';

const { kibanaRoot } = _config;

const defaultQuery = {
  index: '',
  query: '',
  forceRemoveFromCmr: false
};

const BulkDeleteModal = ({
  className,
  dispatch,
  handleSuccessConfirm,
  onCancel,
  operation,
  requestId,
  selected,
  showModal
}) => {
  const [query, setQuery] = useState(JSON.stringify(defaultQuery, null, 2));
  const [errorState, setErrorState] = useState();

  const status = get(operation, ['status']);
  const error = get(operation, ['error']);
  const asyncOpId = get(operation, ['data', 'id']);

  const inflight = status === 'inflight';
  const success = status === 'success';
  const buttonText = inflight ? 'loading...'
    : success ? 'Success!' : 'Run Bulk Delete';
  const formError = error || errorState;

  function handleSubmit (e) {
    e.preventDefault();
    if (status !== 'inflight') {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkGranuleDelete({ requestId, json }));
    }
  }

  function onChange (id, value) {
    setQuery(value);
  }

  return (
    <DefaultModal
      title='Bulk Granule Delete'
      className={className}
      showModal={showModal}
      cancelButtonText={success ? 'Close' : 'Cancel Bulk Delete'}
      confirmButtonText={success ? 'Go To Operations' : buttonText}
      confirmButtonClass='button__bulkgranules'
      onCancel={onCancel}
      onCloseModal={onCancel}
      onConfirm={success ? handleSuccessConfirm : handleSubmit}
    >
      {success &&
        <p>
          Your request to process a bulk granule delete operation has been submitted. <br/>
          ID <strong>{asyncOpId}</strong>
        </p>
      }
      {!success &&
        <>
          <h4 className="modal_subtitle">To run and complete your bulk delete task:</h4>
          <p>
            1. In the box below, add either an array of granule Ids or an elasticsearch query and index. <br/>
            2. Set <strong>forceRemoveFromCmr</strong> to <strong>true</strong> to automatically have granules removed from CMR as part of deletion.<br/>
            If <strong>forceRemoveFromCmr</strong> is <strong>false</strong>, then the bulk granule deletion will <strong>fail for any granules that are published to CMR.</strong>
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
              error={formError}
              onChange={onChange}
              mode='json'
              minLines={30}
              maxLines={200}
            />
          </form>
        </>
      }
    </DefaultModal>
  );
};

BulkDeleteModal.propTypes = {
  className: PropTypes.string,
  dispatch: PropTypes.func,
  handleSuccessConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  operation: PropTypes.object,
  requestId: PropTypes.string,
  selected: PropTypes.array,
  showModal: PropTypes.bool
};

export default BulkDeleteModal;
