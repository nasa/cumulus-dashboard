import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class CollectionDeleteModal extends React.Component {
  constructor (props) {
    super(props)

    this.onModalClose = this.onModalClose.bind(this);
  }

  onModalClose () {
    const {onToggleCollectionDeleteModal} = this.props
    onToggleCollectionDeleteModal(false)
  }
  
  render () {
    const {
      isOpen
    } = this.props;

    return (
      <Modal
        dialogClassName="collection-delete-modal"
        show={isOpen}
        onHide={this.onModalClose}
        centered
        size="md"
        aria-labelledby="modal__collection-delete-modal"
        >
        <Modal.Header className="collection-delete-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__collection-delete-modal" className="collection-delete-modal__title">Delete Collection</Modal.Title>
        <Modal.Body>
          <p>
            You have submitted a request to delete collection. Are you sure that you want to delete this collection?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='button button--confirm button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
            onClick={this.confirm}>
              Delete Collection
          </Button>
          <Button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
            onClick={this.cancel}>
              Cancel Request
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CollectionDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleCollectionDeleteModal: PropTypes.func.isRequired
}

export default CollectionDeleteModal;
