import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class CollectionDeletedConfirmModal extends React.Component {
  render () {
    return (
      <Modal
        dialogClassName="collection-deleted-confirm-modal"
        show
        centered
        size="md"
        aria-labelledby="modal__collection-deleted-confirm-modal"
        >
        <Modal.Header className="collection-deleted-confirm-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__collection-deleted-confirm-modal" className="collection-deleted-confirm-modal__title">Delete Collection</Modal.Title>
        <Modal.Body>
          <p>
           Collection {(`${collectionName} ${collectionVersion}`)} has been deleted.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
            onClick={this.cancel}>
              Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CollectionDeletedConfirmModal.propTypes = {
};

export default CollectionDeletedConfirmModal;
