'use strict';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
import BulkOperationsModal from './bulk-granule-operations';
import BulkDeleteModal from './bulk-granule-delete';

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
  const [requestId] = useState(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  const [showBulkOpsModal, setShowBulkOpsModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const status = get(granules.bulk, [requestId, 'status']);
  const error = get(granules.bulk, [requestId, 'error']);
  const asyncOpId = get(granules.bulk, [requestId, 'data', 'id']);

  const inflight = status === 'inflight';
  const success = status === 'success';
  const ButtonComponent = element;
  const modalClassName = 'bulk_granules';

  const buttonClass = `button button--small form-group__element button--green
    ${inflight ? ' button--loading' : ''}
    ${className ? ` ${className}` : ''}`;

  const elementClass = `async__element
    ${inflight ? ' async__element--loading' : ''}
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

  function hideBulkOperationsModal (e) {
    setShowModal(false);
    setShowBulkOpsModal(false);
  }

  function handleShowBulkDeleteModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkDeleteModal(true);
  }

  function hideBulkDeleteModal (e) {
    setShowModal(false);
    setShowBulkDeleteModal(false);
  }

  return (
    <>
      <ButtonComponent
        className={element === 'button' ? buttonClass : elementClass}
        onClick={handleClick}
      >
        <span>Run Bulk Granules{inflight && <Ellipsis />}</span>
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
            className={'button button__animation--md button__arrow button__animation button--secondary form-group__element--left button--delete'}
            onClick={handleShowBulkDeleteModal}>
            Run Bulk Deletion
          </button>
          <button
            className={'button button__animation--md button__arrow button__animation form-group__element--left'}
            onClick={handleShowBulkOperationsModal}>
            Run Bulk Operations
          </button>
        </Modal.Body>
      </Modal>
      <BulkOperationsModal
        className={modalClassName}
        dispatch={dispatch}
        showModal={showBulkOpsModal}
        handleSuccessConfirm={handleSuccessConfirm}
        onCancel={hideBulkOperationsModal}
        onCloseModal={hideBulkOperationsModal}
        error={error}
        asyncOpId={asyncOpId}
        inflight={inflight}
        requestId={requestId}
        selected={selected}
        success={success}
      ></BulkOperationsModal>
      <BulkDeleteModal
        className={modalClassName}
        dispatch={dispatch}
        showModal={showBulkDeleteModal}
        handleSuccessConfirm={handleSuccessConfirm}
        onCancel={hideBulkDeleteModal}
        onCloseModal={hideBulkDeleteModal}
        error={error}
        asyncOpId={asyncOpId}
        inflight={inflight}
        requestId={requestId}
        selected={selected}
        success={success}
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
