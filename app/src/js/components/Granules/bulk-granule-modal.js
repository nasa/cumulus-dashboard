import React, { useState } from 'react';
import PropTypes from 'prop-types';

import _config from '../../config';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';

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
  handleSuccessConfirm,
  inflight,
  onCancel,
  requestId,
  showModal,
  selected = [],
  success,
  successMessage,
  title
}) => {
  const [query, setQuery] = useState(JSON.stringify(defaultQuery, null, 2));
  const [errorState, setErrorState] = useState();

  const buttonText = inflight ? 'loading...'
    : success ? 'Success!' : confirmButtonText;
  const formError = errorState || error;

  function handleSubmit (e) {
    e.preventDefault();
    if (!inflight) {
      try {
        var json = JSON.parse(query);
      } catch (e) {
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
      }
    }
    setQuery(value);
  }

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
              id={`run-bulk-granule-${requestId}`}
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
  handleSuccessConfirm: PropTypes.func,
  inflight: PropTypes.bool,
  onCancel: PropTypes.func,
  requestId: PropTypes.string,
  selected: PropTypes.array,
  showModal: PropTypes.bool,
  success: PropTypes.bool,
  successMessage: PropTypes.string,
  title: PropTypes.string
};

export default BulkGranuleModal;
