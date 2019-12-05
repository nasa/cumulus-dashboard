import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class BatchDeleteCollectionModal extends React.Component {
  render () {
    return (
      <Modal
        dialogClassName="batch-delete-collection-modal"
        show
        centered
        size="md"
        aria-labelledby="modal__batch-delete-collection-modal"
        >
        <Modal.Header className="batch-delete-collection-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__batch-delete-collection-modal" className="batch-delete-collection-modal__title">Delete Batch Collections</Modal.Title>
        <Modal.Body>
          <p>
           You have submitted a request to delete the following collections
           { /* Need to map <li> based on what collections where selected by user in the table */ }
            <ul>
              <li>
                {/* {(`${collectionName} ${collectionVersion}`)} */}
              </li>
            </ul>.
            Are you sure that you want to delete all of these?
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
              Delete Collections
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

BatchDeleteCollectionModal.propTypes = {
};

export default BatchDeleteCollectionModal;
