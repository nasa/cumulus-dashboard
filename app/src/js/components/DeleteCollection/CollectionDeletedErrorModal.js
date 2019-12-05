import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class CollectionDeletedErrorModal extends React.Component {
  render () {
    return (
      <Modal
        dialogClassName="collection-deleted-error-modal"
        show
        centered
        size="md"
        aria-labelledby="modal__collection-deleted-error-modal"
        >
        <Modal.Header className="collection-deleted-error-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__collection-deleted-error-modal" className="collection-deleted-error-modal__title">Delete Collection</Modal.Title>
        <Modal.Body>
          <p>
           Collection {(`${collectionName} ${collectionVersion}`)} has encountered an error. [Error message number here]
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
            onClick={this.cancel}>
              Close
          </Button>
          <Button
            className='button button__gotogranules button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
            onClick={this.confirm}>
              Go To Granules
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CollectionDeletedErrorModal.propTypes = {
};

export default CollectionDeletedErrorModal;
