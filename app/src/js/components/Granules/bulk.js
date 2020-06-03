'use strict';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import {
  bulkGranuleClearError,
  bulkGranuleDeleteClearError
} from '../../actions';
import BulkOperationsModal from './bulk-granule-operations';
import BulkDeleteModal from './bulk-granule-delete';

const generateAsyncRequestId = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const getRequestStatus = (request) => get(request, ['status']);
const getRequestError = (request) => get(request, ['error']);
const getRequestAsyncOpId = (request) => get(request, ['data', 'id']);

const isStatusInflight = (status) => status === 'inflight';
const isStatusSuccess = (status) => status === 'success';

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
    history.push('/operations');
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
      <BulkOperationsModal
        asyncOpId={getRequestAsyncOpId(bulkOpRequestInfo)}
        className={modalClassName}
        dispatch={dispatch}
        error={bulkOpRequestError}
        showModal={showBulkOpsModal}
        handleSuccessConfirm={handleSuccessConfirm}
        inflight={isStatusInflight(bulkOpRequestStatus)}
        onCancel={hideBulkOperationsModal}
        onCloseModal={hideBulkOperationsModal}
        operation={bulkOpRequestInfo}
        requestId={bulkOpRequestId}
        selected={selected}
        success={isStatusSuccess(bulkOpRequestStatus)}
      ></BulkOperationsModal>
      <BulkDeleteModal
        asyncOpId={getRequestAsyncOpId(bulkDeleteRequestInfo)}
        className={modalClassName}
        dispatch={dispatch}
        error={bulkDeleteRequestError}
        showModal={showBulkDeleteModal}
        handleSuccessConfirm={handleSuccessConfirm}
        inflight={isStatusInflight(bulkDeleteRequestStatus)}
        onCancel={hideBulkDeleteModal}
        onCloseModal={hideBulkDeleteModal}
        operation={bulkDeleteRequestInfo}
        requestId={bulkDeleteRequestId}
        selected={selected}
        success={isStatusSuccess(bulkDeleteRequestStatus)}
      ></BulkDeleteModal>
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
