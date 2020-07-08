import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
// import Button from '../Button/Button';
import {
  collectionName as collectionLabelForId,
  deleteText
} from '../../utils/format';

class DeleteCollectionModal extends React.Component {
  constructor (props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCancel () {
    this.props.onCancel();
  }

  handleConfirm () {
    this.props.onConfirm();
  }

  render () {
    return (
      <Modal
        dialogClassName="delete-collection-modal"
        show={this.props.show}
        onHide={this.handleCancel}
        centered
        size="md"
        aria-labelledby="modal__delete-collection-modal"
      >
        <Modal.Header className="delete-collection-modal__header" closeButton />
        <Modal.Title
          id="modal__delete-collection-modal"
          className="delete-collection-modal__title"
        >
          Delete Collection
        </Modal.Title>
        <Modal.Body>
          <p>
            {deleteText(`collection "${collectionLabelForId(this.props.collectionLabel)}"`)}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left'
            label="cancel"
            onClick={this.handleCancel}
          >
            Cancel Request
          </button>
          <button
            className='button button__deletecollections button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
            label="confirm"
            onClick={this.handleConfirm}
          >
            Delete Collection
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DeleteCollectionModal.propTypes = {
  collectionLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  show: PropTypes.bool
};

export default DeleteCollectionModal;
