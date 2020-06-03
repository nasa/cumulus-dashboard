import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { bulkGranuleDelete } from '../../actions';
import _config from '../../config';
import { updateSelectedQueryIds } from '../../utils/bulk';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';

const { kibanaRoot } = _config;

const defaultQuery = {
  index: '',
  query: '',
  ids: [],
  forceRemoveFromCmr: false
};

const BulkDeleteModal = ({
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
    : success ? 'Success!' : 'Run Bulk Delete';
  const formError = errorState || error;

  function handleSubmit (e) {
    e.preventDefault();
    if (!inflight) {
      try {
        var json = JSON.parse(query);
      } catch (e) {
        return setErrorState('Syntax error in JSON');
      }
      dispatch(bulkGranuleDelete({ requestId, json }));
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
      title='Bulk Granule Delete'
      className={`${className} bulk_granules--delete`}
      showModal={showModal}
      cancelButtonText={success ? 'Close' : 'Cancel Bulk Delete'}
      confirmButtonText={success ? 'Go To Operations' : buttonText}
      confirmButtonClass='button__bulkgranules button__bulkgranules--delete'
      onCancel={onCancel}
      onCloseModal={onCancel}
      onConfirm={success ? handleSuccessConfirm : handleSubmit}
    >
      {success &&
        <div className="message__success">
          <p>
            Your request to process a bulk granule delete operation has been submitted. <br/>
            ID <strong>{asyncOpId}</strong>
          </p>
        </div>
      }
      {!success &&
        <div className="form__bulkgranules">
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
        </div>
      }
    </DefaultModal>
  );
};

BulkDeleteModal.propTypes = {
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

export default BulkDeleteModal;
