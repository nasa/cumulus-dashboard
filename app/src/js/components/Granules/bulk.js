import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import {
  bulkGranule,
  bulkGranuleDelete,
  bulkGranuleClearError,
  bulkGranuleDeleteClearError
} from '../../actions';
import BulkGranuleModal from './bulk-granule-modal';
import { historyPushWithQueryParams } from '../../utils/url-helper';

const generateAsyncRequestId = () => Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const getRequestStatus = (request) => get(request, ['status']);
const getRequestError = (request) => get(request, ['error']);
const getRequestAsyncOpId = (request) => get(request, ['data', 'id']);

const isStatusInflight = (status) => status === 'inflight';
const isStatusSuccess = (status) => status === 'success';

const bulkOperationsDefaultQuery = {
  workflowName: '',
  index: '',
  query: '',
  ids: [],
  meta: {}
};

const bulkDeleteDefaultQuery = {
  index: '',
  query: '',
  ids: [],
  forceRemoveFromCmr: false
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
  const [showBulkOpsModal, setShowBulkOpsModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkOpRequestId, setBulkOpRequestId] = useState(generateAsyncRequestId());
  const [bulkDeleteRequestId, setBulkDeleteRequestId] = useState(generateAsyncRequestId());

  const bulkOpRequestInfo = get(granules.bulk, [bulkOpRequestId]);
  const bulkOpRequestStatus = getRequestStatus(bulkOpRequestInfo);
  const bulkOpRequestError = getRequestError(bulkOpRequestInfo);

  const bulkDeleteRequestInfo = get(granules.bulkDelete, [bulkDeleteRequestId]);
  const bulkDeleteRequestStatus = getRequestStatus(bulkDeleteRequestInfo);
  const bulkDeleteRequestError = getRequestError(bulkDeleteRequestInfo);

  const ButtonComponent = element;
  const modalClassName = 'bulk_granules';

  const buttonClass = `button button--small form-group__element button--green
    ${className ? ` ${className}` : ''}`;

  const elementClass = `async__element
    ${className ? ` ${className}` : ''}`;

  function handleCancel (e) {
    setShowModal(false);
  }

  function handleClick (e) {
    e.preventDefault();
    if (confirmAction) {
      setShowModal(true);
    }
  }

  function handleSuccessConfirm (e) {
    e.preventDefault();
    historyPushWithQueryParams('/operations');
  }

  function handleShowBulkOperationsModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkOpsModal(true);
  }

  function hideBulkOperationsModal () {
    // If last operation succeeded, generate a new request ID so
    // modal doesn't still show success of last operation
    if (isStatusSuccess(bulkOpRequestStatus)) {
      setBulkOpRequestId(generateAsyncRequestId());
    }
    // clear error from any previous request failure
    if (bulkOpRequestError) {
      dispatch(bulkGranuleClearError(bulkOpRequestId));
    }
    setShowBulkOpsModal(false);
  }

  function handleShowBulkDeleteModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkDeleteModal(true);
  }

  function hideBulkDeleteModal () {
    // If last operation succeeded, generate a new request ID so
    // modal doesn't still show success of last operation
    if (isStatusSuccess(bulkDeleteRequestStatus)) {
      setBulkDeleteRequestId(generateAsyncRequestId());
    }
    // clear error from any previous request failure
    if (bulkDeleteRequestError) {
      dispatch(bulkGranuleDeleteClearError(bulkDeleteRequestId));
    }
    // clear error from any previous request failure
    setShowBulkDeleteModal(false);
  }

  return (
    <>
      <ButtonComponent
        className={element === 'button' ? buttonClass : elementClass}
        onClick={handleClick}
      >
        <span>Run Bulk Granules</span>
      </ButtonComponent>
      <Modal
        dialogClassName={`default-modal ${modalClassName}`}
        show={showModal}
        onHide={handleCancel}
        centered
        size="sm"
        aria-labelledby={`modal__${modalClassName}`}
      >
        <Modal.Header className={`${modalClassName}__header`} closeButton></Modal.Header>
        <Modal.Title id={`modal__${modalClassName}`} className={`${modalClassName}__title`}>
          What would you like to do?
        </Modal.Title>
        <Modal.Body>
          <button
            className={'button button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--delete form-group__element--left'}
            onClick={handleShowBulkDeleteModal}>
            Run Bulk Delete
          </button>
          <button
            className={'button button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--operations form-group__element--left'}
            onClick={handleShowBulkOperationsModal}>
            Run Bulk Operations
          </button>
        </Modal.Body>
      </Modal>
      <BulkGranuleModal
        asyncOpId={getRequestAsyncOpId(bulkOpRequestInfo)}
        bulkRequestAction={bulkGranule}
        cancelButtonText={'Cancel Bulk Operations'}
        className={`${modalClassName} bulk_granules--operations`}
        confirmButtonClass={'button__bulkgranules button__bulkgranules--operations'}
        confirmButtonText={'Run Bulk Operations'}
        defaultQuery={bulkOperationsDefaultQuery}
        dispatch={dispatch}
        error={bulkOpRequestError}
        handleSuccessConfirm={handleSuccessConfirm}
        inflight={isStatusInflight(bulkOpRequestStatus)}
        onCancel={hideBulkOperationsModal}
        requestId={bulkOpRequestId}
        selected={selected}
        showModal={showBulkOpsModal}
        success={isStatusSuccess(bulkOpRequestStatus)}
        successMessage={'Your request to process a bulk granules operation has been submitted.'}
        title={'Bulk Granule Operations'}
      >
        <h4 className="modal_subtitle">To run and complete your bulk granule task:</h4>
        <p>
          1. In the box below, enter the <strong>workflowName</strong>. <br/>
          2. Then add either an array of granule Ids or an elasticsearch query and index. <br/>
        </p>
      </BulkGranuleModal>
      <BulkGranuleModal
        asyncOpId={getRequestAsyncOpId(bulkDeleteRequestInfo)}
        bulkRequestAction={bulkGranuleDelete}
        cancelButtonText={'Cancel Bulk Delete'}
        className={`${modalClassName} bulk_granules--delete`}
        confirmButtonClass={'button__bulkgranules button__bulkgranules--delete'}
        confirmButtonText={'Run Bulk Delete'}
        defaultQuery={bulkDeleteDefaultQuery}
        dispatch={dispatch}
        error={bulkDeleteRequestError}
        handleSuccessConfirm={handleSuccessConfirm}
        inflight={isStatusInflight(bulkDeleteRequestStatus)}
        onCancel={hideBulkDeleteModal}
        requestId={bulkDeleteRequestId}
        selected={selected}
        showModal={showBulkDeleteModal}
        success={isStatusSuccess(bulkDeleteRequestStatus)}
        successMessage={'Your request to process a bulk granule delete operation has been submitted.'}
        title={'Bulk Granule Delete'}
      >
        <h4 className="modal_subtitle">To run and complete your bulk delete task:</h4>
        <p>
          1. In the box below, add either an array of granule Ids or an elasticsearch query and index. <br/>
          2. Set <strong>forceRemoveFromCmr</strong> to <strong>true</strong> to automatically have granules
          removed from CMR as part of deletion.<br/>
          If <strong>forceRemoveFromCmr</strong> is <strong>false</strong>, then the bulk granule deletion will
          <strong>fail for any granules that are published to CMR.</strong>
        </p>
      </BulkGranuleModal>
    </>
  );
};

BulkGranule.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  confirmAction: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string,
  granules: PropTypes.object,
  selected: PropTypes.array
};

export default withRouter(connect((state) => ({
  granules: state.granules
}))(BulkGranule));
