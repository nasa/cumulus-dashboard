import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
// import Button from '../Button/Button';

class CollectionDeletedConfirmModal extends React.Component {
  constructor (props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose (e) {
    e.preventDefault();
    this.props.onClose();
  }

  render () {
    return (
      <Modal
        dialogClassName="collection-deleted-confirm-modal"
        show={this.props.show}
        onHide={this.handleClose}
        centered
        size="md"
        aria-labelledby="modal__collection-deleted-confirm-modal"
      >
        <Modal.Header className="collection-deleted-confirm-modal__header" closeButton onClick={this.handleClose}/>
        <Modal.Title
          id="modal__collection-deleted-confirm-modal"
          className="collection-deleted-confirm-modal__title"
        >
          Delete Collection
        </Modal.Title>
        <Modal.Body>
          <Alert variant="success"><strong>Success</strong></Alert>
            Collection {`"${this.props.collectionLabel}"`} has been deleted.
        </Modal.Body>
        <Modal.Footer>
          <button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left'
            label="close"
            onClick={this.handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CollectionDeletedConfirmModal.propTypes = {
  collectionLabel: PropTypes.string,
  onClose: PropTypes.func,
  show: PropTypes.bool
};

export default CollectionDeletedConfirmModal;
