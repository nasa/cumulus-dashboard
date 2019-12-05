import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class DeleteCollectionModal extends React.Component {
  render () {
    return (
      <Modal
        dialogClassName="delete-collection-modal"
        show
        centered
        size="md"
        aria-labelledby="modal__delete-collection-modal"
        >
        <Modal.Header className="delete-collection-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__delete-collection-modal" className="delete-collection-modal__title">Delete Collection</Modal.Title>
        <Modal.Body>
          <p>
           You have submitted a request to delete collection {(`${collectionName} ${collectionVersion}`)}. Are you sure that you want to delete this collection?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
            onClick={this.cancel}>
              Cancel Request
          </Button>
          <Button
            className='button button__deletecollections button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
            onClick={this.confirm}>
              Delete Collection
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteCollectionModal.propTypes = {
};

export default DeleteCollectionModal;
