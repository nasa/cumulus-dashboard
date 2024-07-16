import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import DefaultModal from '../Modal/modal';

const DeleteCollectionModal = ({ collectionLabel, onCancel, onConfirm, show }) => (
      <DefaultModal
        showModal = {show}
        onCloseModal={onCancel}
        className={'delete-collection-modal'}
        hasCancelButton={false}
        hasConfirmButton={false}
        title='Delete Collection'
        onHide={onCancel}
        aria-labelledby="modal__delete-collection-modal"
        onCancel={onCancel}
        onConfirm={onConfirm}
      >
        <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>
        <p> You have submitted a request to delete the following collection: </p>
        <br />
        <h1>
          <strong>{collectionLabel}</strong>
        </h1>
        <br />
        <p> Are you sure you want to permanently delete this collection? </p>
        <button
          className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left'
          label="cancel"
          onClick={onCancel}
        >
            Cancel Request
        </button>
        <button
          className='button button__deletecollections button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
          label="confirm"
          onClick={onConfirm}
        >
            Delete Collection
        </button>
      </DefaultModal>

);

DeleteCollectionModal.propTypes = {
  collectionLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  show: PropTypes.bool
};

export default DeleteCollectionModal;
