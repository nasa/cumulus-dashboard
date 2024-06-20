import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Modal } from 'react-bootstrap';
import DefaultModal from '../Modal/modal';

const DeleteCollectionModal = ({
  onCancel,
  onConfirm,
  show,
  collectionLabel = ''
}) => {
  function handleCancel() {
    onCancel();
  }
  function handleConfirm() {
    onConfirm();
  }

  return (
    <DefaultModal
      showModal = {show}
      onCloseModal={handleCancel}
      className={'delete-collection-modal'}
      hasCancelButton={false}
      hasConfirmButton={false}
      title='Delete Collection'
      onHide={handleCancel}
      aria-labelledby="modal__delete-collection-modal"
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    >
      <Modal.Body>
      <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>
      <p> You have submitted a request to delete the following collection: </p>
      <Modal.Header className="d-flex justify-content-center">
        <strong>{collectionLabel}</strong>
      </Modal.Header>
      <br />
      <p> Are you sure you want to permanently delete this collection? </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
      <button
          className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left'
          onClick={handleCancel}
      >
          Cancel Request
      </button>
      <button
        className='button button__deletecollections button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
        onClick={handleConfirm}
      >
          Delete Collection
      </button>
      </Modal.Footer>
    </DefaultModal>
  );
};

DeleteCollectionModal.propTypes = {
  collectionLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  show: PropTypes.bool
};

export default DeleteCollectionModal;
