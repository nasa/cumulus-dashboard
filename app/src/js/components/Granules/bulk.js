import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get } from 'object-path';

import {
  bulkGranule,
  bulkGranuleDelete,
  bulkGranuleReingest,
  bulkGranuleClearError,
  bulkGranuleDeleteClearError,
  bulkGranuleReingestClearError,
} from '../../actions';
import BulkGranuleModal from './bulk-granule-modal';
import { historyPushWithQueryParams } from '../../utils/url-helper';
import DefaultModal from '../Modal/modal';

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

const bulkReingestDefaultQuery = {
  index: '',
  query: '',
  ids: []
};

const bulkRecoveryDefaultQuery = {
  workflowName: '',
  index: '',
  query: '',
  ids: []
};

const BulkGranule = ({
  history,
  dispatch,
  className,
  config,
  confirmAction,
  granules,
  element = 'button',
  selected
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showBulkOpsModal, setShowBulkOpsModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showBulkReingestModal, setShowBulkReingestModal] = useState(false);
  const [showBulkRecoveryModal, setShowBulkRecoveryModal] = useState(false);
  const [bulkOpRequestId, setBulkOpRequestId] = useState(generateAsyncRequestId());
  const [bulkDeleteRequestId, setBulkDeleteRequestId] = useState(generateAsyncRequestId());
  const [bulkReingestRequestId, setBulkReingestRequestId] = useState(generateAsyncRequestId());
  const [bulkRecoveryRequestId, setBulkRecoveryRequestId] = useState(generateAsyncRequestId());

  const activeModal = showModal || showBulkOpsModal || showBulkDeleteModal ||
    showBulkReingestModal || showBulkRecoveryModal;

  const bulkOpRequestInfo = get(granules.bulk, [bulkOpRequestId]);
  const bulkOpRequestStatus = getRequestStatus(bulkOpRequestInfo);
  const bulkOpRequestError = getRequestError(bulkOpRequestInfo);

  const bulkDeleteRequestInfo = get(granules.bulkDelete, [bulkDeleteRequestId]);
  const bulkDeleteRequestStatus = getRequestStatus(bulkDeleteRequestInfo);
  const bulkDeleteRequestError = getRequestError(bulkDeleteRequestInfo);

  const bulkReingestRequestInfo = get(granules.bulkReingest, [bulkReingestRequestId]);
  const bulkReingestRequestStatus = getRequestStatus(bulkReingestRequestInfo);
  const bulkReingestRequestError = getRequestError(bulkReingestRequestInfo);

  const bulkRecoveryRequestInfo = get(granules.bulk, [bulkRecoveryRequestId]);
  const bulkRecoveryRequestStatus = getRequestStatus(bulkRecoveryRequestInfo);
  const bulkRecoveryRequestError = getRequestError(bulkRecoveryRequestInfo);

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

  function handleShowBulkReingestModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkReingestModal(true);
  }

  function hideBulkReingestModal () {
    // If last operation succeeded, generate a new request ID so
    // modal doesn't still show success of last operation
    if (isStatusSuccess(bulkReingestRequestStatus)) {
      setBulkReingestRequestId(generateAsyncRequestId());
    }
    // clear error from any previous request failure
    if (bulkReingestRequestError) {
      dispatch(bulkGranuleReingestClearError(bulkReingestRequestId));
    }
    // clear error from any previous request failure
    setShowBulkReingestModal(false);
  }

  function handleShowBulkRecoveryModal (e) {
    e.preventDefault();
    setShowModal(false);
    setShowBulkRecoveryModal(true);
  }

  function hideBulkRecoveryModal () {
    // If last operation succeeded, generate a new request ID so
    // modal doesn't still show success of last operation
    if (isStatusSuccess(bulkRecoveryRequestStatus)) {
      setBulkRecoveryRequestId(generateAsyncRequestId());
    }
    // clear error from any previous request failure
    if (bulkRecoveryRequestError) {
      dispatch(bulkGranuleClearError(bulkRecoveryRequestId));
    }
    // clear error from any previous request failure
    setShowBulkRecoveryModal(false);
  }

  return (
    <>
      <ButtonComponent
        className={element === 'button' ? buttonClass : elementClass}
        onClick={handleClick}
      >
        <span>Run Bulk Granules</span>
      </ButtonComponent>
      {activeModal && <div className="modal__cover"></div>}
      <div
        className={
          activeModal
            ? 'modal__container modal__container--onscreen'
            : 'modal__container'
        }
      >
        <DefaultModal
          showModal={showModal}
          onCloseModal={handleCancel}
          className={modalClassName}
          hasCancelButton={false}
          hasConfirmButton={false}
          title="Run Bulk Granules"
        >
          <p>What action would you like to perform for your bulk granules selection?</p>
          <button
            className={'button button--small button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--delete form-group__element--left'}
            onClick={handleShowBulkDeleteModal}>
            Run Bulk Delete
          </button>
          <button
            className={'button button--small button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--reingest form-group__element--left'}
            onClick={handleShowBulkReingestModal}>
            Run Bulk Reingest
          </button>
          {config.enableRecovery &&
          <button
            className={'button button--small button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--recovery form-group__element--left'}
            onClick={handleShowBulkRecoveryModal}>
            Run Bulk Recovery
          </button>
          }
          <button
            className={'button button--small button__animation--md button__arrow button__animation button__bulkgranules button__bulkgranules--operations form-group__element--left'}
            onClick={handleShowBulkOperationsModal}>
            Run Bulk Operations
          </button>
        </DefaultModal>
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
          <ol>
            <li>In the box below, enter the <strong>workflowName</strong>.</li>
            <li>Then add either an array of granule Ids or an elasticsearch query and index.</li>
          </ol>
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
          <ol>
            <li>In the box below, add either an array of granule Ids or an elasticsearch query and index.</li>
            <li>Set <strong>forceRemoveFromCmr</strong> to <strong>true</strong> to automatically have granules
            removed from CMR as part of deletion.
            If <strong>forceRemoveFromCmr</strong> is <strong>false</strong>, then the bulk granule deletion will
            <strong> fail for any granules that are published to CMR.</strong>
            </li>
          </ol>
        </BulkGranuleModal>
        <BulkGranuleModal
          asyncOpId={getRequestAsyncOpId(bulkReingestRequestInfo)}
          bulkRequestAction={bulkGranuleReingest}
          cancelButtonText={'Cancel Bulk Reingest'}
          className={`${modalClassName} bulk_granules--reingest`}
          confirmButtonClass={'button__bulkgranules button__bulkgranules--reingest'}
          confirmButtonText={'Run Bulk Reingest'}
          defaultQuery={bulkReingestDefaultQuery}
          dispatch={dispatch}
          error={bulkReingestRequestError}
          handleSuccessConfirm={handleSuccessConfirm}
          inflight={isStatusInflight(bulkReingestRequestStatus)}
          onCancel={hideBulkReingestModal}
          queryWorkflowOptions={true}
          requestId={bulkReingestRequestId}
          selected={selected}
          selectWorkflow={true}
          showModal={showBulkReingestModal}
          success={isStatusSuccess(bulkReingestRequestStatus)}
          successMessage={'Your request to process a bulk granule reingest operation has been submitted.'}
          title={'Bulk Granule Reingest'}
        >
          <h4 className="modal_subtitle">To run and complete your bulk reingest task:</h4>
          <ol>
            <li>In the box below, add either an array of granule Ids or an elasticsearch query and index.</li>
            <li>Then select workflow to rerun for all the selected granules. The workflows listed are the
              intersection of the selected granules' workflows.</li>
          </ol>
        </BulkGranuleModal>
        {config.enableRecovery &&
        <BulkGranuleModal
          asyncOpId={getRequestAsyncOpId(bulkRecoveryRequestInfo)}
          bulkRequestAction={bulkGranule}
          cancelButtonText={'Cancel Bulk Recovery'}
          className={`${modalClassName} bulk_granules--recovery`}
          confirmButtonClass={'button__bulkgranules button__bulkgranules--recovery'}
          confirmButtonText={'Run Bulk Recovery'}
          defaultQuery={bulkRecoveryDefaultQuery}
          dispatch={dispatch}
          error={bulkRecoveryRequestError}
          handleSuccessConfirm={handleSuccessConfirm}
          inflight={isStatusInflight(bulkRecoveryRequestStatus)}
          onCancel={hideBulkRecoveryModal}
          requestId={bulkRecoveryRequestId}
          selected={selected}
          showModal={showBulkRecoveryModal}
          success={isStatusSuccess(bulkRecoveryRequestStatus)}
          successMessage={'Your request to process a bulk granule recovery operation has been submitted.'}
          title={'Bulk Granules - Recovery'}
        >
          <h4 className="modal_subtitle">To run and complete your bulk granule task:</h4>
          <ol>
            <li>In the box below, enter the workflowName.</li>
            <li>Then add either an array of granule Ids or an Elasticsearch query and
              index (<i>see below</i>).</li>
          </ol>
        </BulkGranuleModal>
        }
      </div>
    </>
  );
};

BulkGranule.propTypes = {
  history: PropTypes.object,
  dispatch: PropTypes.func,
  config: PropTypes.object,
  confirmAction: PropTypes.bool,
  className: PropTypes.string,
  element: PropTypes.string,
  granules: PropTypes.object,
  selected: PropTypes.arrayOf(PropTypes.shape({
    granuleId: PropTypes.string,
    collectionId: PropTypes.string,
  }))
};

export { BulkGranule };

export default withRouter(connect((state) => ({
  config: state.config,
  granules: state.granules
}))(BulkGranule));
