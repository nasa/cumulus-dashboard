'use strict';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import { bulkGranule } from '../../actions';
import Ellipsis from '../LoadingEllipsis/loading-ellipsis';
// import _config from '../../config';
// import TextArea from '../TextAreaForm/text-area';
// import DefaultModal from '../Modal/modal';
import BulkOperationsModal from './bulk-granule-operations';

// const { kibanaRoot } = _config;

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
  const [showBulkOpsModal, setShowBulkOpsModal] = useState(false);

  const status = get(granules.bulk, [requestId, 'status']);
  const error = get(granules.bulk, [requestId, 'error']) || errorState;
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

  function showBulkOperationsModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkOpsModal(true);
  }

  function hideBulkOperationsModal (e) {
    setShowModal(false);
    setShowBulkOpsModal(false);
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
            onClick={handleCancel}>
            Run Bulk Deletion
          </button>
          <button
            className={'button button__animation--md button__arrow button__animation form-group__element--left'}
            onClick={showBulkOperationsModal}>
            Run Bulk Operations
          </button>
        </Modal.Body>
      </Modal>
      <BulkOperationsModal
        title='Bulk Granules'
        className={modalClassName}
        showModal={showBulkOpsModal}
        onCancel={hideBulkOperationsModal}
        onChange={onChange}
        onCloseModal={hideBulkOperationsModal}
        onConfirm={success ? handleSuccessConfirm : handleSubmit}
        query={query}
        error={error}
        asyncOpId={asyncOpId}
        inflight={inflight}
        selected={selected}
      ></BulkOperationsModal>
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
