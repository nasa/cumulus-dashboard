import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import './ProcessingModal.scss';

class ProcessingModal extends React.Component {
  constructor () {
    super();
  }

  render () {
    const {
      isOpen
    } = this.props;

    return (
      <Modal
        dialogClassName="processing-modal"
        show={isOpen}
        centered
        size="md"
        aria-labelledby="modal__processing-modal"
        >
        <Modal.Header className="processing-modal__header"></Modal.Header>
    <Modal.Title id="modal__processing-modal" className="processing-modal__title">{ /* This title is based on the previous modal's title */}</Modal.Title>
        <Modal.Body>
          <h2>Your request is processing...</h2>
          <span className="processing-bar">

          </span>
          <p>Please don’t click the back or refresh button. Doing so may delay or interrupt your request.</p>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

ProcessingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default ProcessingModal;
