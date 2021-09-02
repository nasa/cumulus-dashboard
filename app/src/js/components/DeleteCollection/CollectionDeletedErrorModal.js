import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
import ErrorReport from '../Errors/report';

class CollectionDeletedErrorModal extends React.Component {
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
        dialogClassName="collection-deleted-error-modal"
        show={this.props.show}
        onHide={this.handleClose}
        centered
        size="md"
        aria-labelledby="modal__collection-deleted-error-modal"
      >
        <Modal.Header className="collection-deleted-error-modal__header" closeButton onClick={this.handleClose}/>
        <Modal.Title
          id="modal__collection-deleted-error-modal"
          className="collection-deleted-error-modal__title"
        >
          Delete Collection
        </Modal.Title>
        <Modal.Body>
          <Alert variant="danger"><strong>Error:</strong> An error occurred attempting to delete collection
            {` "${this.props.collectionLabel}"`}</Alert>
          {this.props.errors.length > 0 &&
            <ErrorReport report={this.props.errors} truncate={true} />
          }
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

CollectionDeletedErrorModal.propTypes = {
  collectionLabel: PropTypes.string,
  errors: PropTypes.array,
  onClose: PropTypes.func,
  show: PropTypes.bool
};

export default CollectionDeletedErrorModal;
