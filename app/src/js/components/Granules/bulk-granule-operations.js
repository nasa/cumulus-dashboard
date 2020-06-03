import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { bulkGranule } from '../../actions';
import _config from '../../config';
import { updateSelectedQueryIds } from '../../utils/bulk';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';

const { kibanaRoot } = _config;

const defaultQuery = {
  workflowName: '',
  index: '',
  query: '',
  ids: []
};

const BulkOperationsModal = ({
  asyncOpId,
  className,
  dispatch,
  error,
  handleSuccessConfirm,
  inflight,
  onCancel,
  requestId,
  showModal,
  selected = [],
  success
}) => {
  const [query, setQuery] = useState(JSON.stringify(defaultQuery, null, 2));
  const [errorState, setErrorState] = useState();

  // TODO: is there a better way to do this?
  updateSelectedQueryIds(setQuery, query, selected);

  const buttonText = inflight ? 'loading...'
    : success ? 'Success!' : 'Run Bulk Operations';
  const formError = errorState || error;

  function handleSubmit (e) {
    e.preventDefault();
    if (!inflight) {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkGranule({ requestId, json }));
    }
  }

  function onChange (id, value) {
    if (errorState) {
      try {
        JSON.parse(value);
        setErrorState();
      } catch (_) {
      }
    }
    setQuery(value);
  }

  return (
    <DefaultModal
      title='Bulk Granule Operations'
      className={`${className} bulk_granules--operations`}
      showModal={showModal}
      cancelButtonText={success ? 'Close' : 'Cancel Bulk Operations'}
      confirmButtonText={success ? 'Go To Operations' : buttonText}
      confirmButtonClass='button__bulkgranules button__bulkgranules--operations'
      onCancel={onCancel}
      onCloseModal={onCancel}
      onConfirm={success ? handleSuccessConfirm : handleSubmit}
    >
      {success &&
        <div className="message__success">
          <p>
            Your request to process a bulk granules operation has been submitted. <br/>
            ID <strong>{asyncOpId}</strong>
          </p>
        </div>
      }
      {!success &&
        <div className="form__bulkgranules">
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
              error={formError}
              onChange={onChange}
              mode='json'
              minLines={30}
              maxLines={200}
            />
          </form>
        </div>
      }
    </DefaultModal>
  );
};

BulkOperationsModal.propTypes = {
  asyncOpId: PropTypes.string,
  className: PropTypes.string,
  dispatch: PropTypes.func,
  error: PropTypes.string,
  handleSuccessConfirm: PropTypes.func,
  inflight: PropTypes.bool,
  onCancel: PropTypes.func,
  requestId: PropTypes.string,
  selected: PropTypes.array,
  showModal: PropTypes.bool,
  success: PropTypes.bool
};

export default BulkOperationsModal;
