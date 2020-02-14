import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const DefaultModal = ({
  className,
  children,
  title,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  showModal,
  onCloseModal,
  onConfirm
}) => {
  function handleCloseModal(e) {
    if (typeof onCloseModal === 'function') {
      onCloseModal(e);
    }
  }

  function handleConfirm(e) {
    if (typeof onConfirm === 'function') {
      onConfirm(e);
    }
  }

  return (
    <Modal
      dialogClassName={`default-modal ${className}`}
      show={showModal}
      onHide={handleCloseModal}
      centered
      size="md"
      aria-labelledby={`modal__${className}`}
      >
      <Modal.Header className={`${className}__header`} closeButton></Modal.Header>
      <Modal.Title id={`modal__${className}`} className={`${className}__title`}>
        { title }
      </Modal.Title>
      <Modal.Body>
        { children }
      </Modal.Body>
      <Modal.Footer>
        <button
          className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
          onClick={handleCloseModal}>
          { cancelButtonText }
        </button>
        <button
          className='button button--submit button__animation--md button__arrow button__arrow--md button__animation form-group__element--left'
          onClick={handleConfirm}>
            { confirmButtonText }
        </button>
      </Modal.Footer>
    </Modal>
  );
};

DefaultModal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  showModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func
};

export default DefaultModal;
