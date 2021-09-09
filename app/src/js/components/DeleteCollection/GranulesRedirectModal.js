import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
// import Button from '../Button/Button';

class GranulesRedirectModal extends React.Component {
  constructor (props) {
    super(props);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCancel (e) {
    e.preventDefault();
    this.props.onCancel();
  }

  handleConfirm (e) {
    e.preventDefault();
    this.props.onConfirm();
  }

  render () {
    return (
      <Modal
        dialogClassName="granules-redirect-modal"
        show={this.props.show}
        onHide={this.handleCancel}
        centered
        size="md"
        aria-labelledby="modal__granules-redirect-modal"
      >
        <Modal.Header className="granules-redirect-modal__header" closeButton onClick={this.handleCancel}/>
        <Modal.Title
          id="modal__granules-redirect-modal"
          className="granules-redirect-modal__title"
        >
          Delete Collection
        </Modal.Title>
        <Modal.Body>
          <Alert variant="warning"><strong>Warning:</strong>There are associated granules.</Alert>
          <p>
            In order to delete collection {`"${this.props.collectionLabel}"`},
            you must first delete the granules associated with it.  Would you
            like to go to the Granules page?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left'
            onClick={this.handleCancel}
            label="cancel"
          >
            Cancel Request
          </button>
          <button
            className='button button__goto button__animation--md button__arrow button__arrow--md button__animation button__arrow--white'
            label="confirm"
            onClick={this.handleConfirm}
          >
            Go To Granules
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

GranulesRedirectModal.propTypes = {
  collectionLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  show: PropTypes.bool
};

export default GranulesRedirectModal;
