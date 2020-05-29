import React from 'react';
import PropTypes from 'prop-types';

import _config from '../../config';
import DefaultModal from '../Modal/modal';
import TextArea from '../TextAreaForm/text-area';

const { kibanaRoot } = _config;

const BulkDeleteModal = ({
  showModal,
  onChange,
  onConfirm,
  onCancel,
  inflight,
  query,
  success,
  asyncOpId,
  error,
  selected
}) => {
  const buttonText = inflight ? 'loading...'
    : success ? 'Success!' : 'Run Bulk Delete';

  return (
    <DefaultModal
      title='Bulk Granule Delete'
      className='bulk_granules'
      showModal={showModal}
      cancelButtonText={success ? 'Close' : 'Cancel Bulk Delete'}
      confirmButtonText={success ? 'Go To Operations' : buttonText}
      confirmButtonClass='button__bulkgranules'
      onCancel={onCancel}
      onCloseModal={onCancel}
      onConfirm={onConfirm}
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
  );
};

BulkDeleteModal.propTypes = {
  showModal: PropTypes.bool,
  onChange: PropTypes.func,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  inflight: PropTypes.bool,
  success: PropTypes.bool,
  asyncOpId: PropTypes.string,
  error: PropTypes.string,
  selected: PropTypes.array,
  query: PropTypes.string
};

export default BulkDeleteModal;
