import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

const DefaultModal = ({
  className = '',
  children,
  title,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  showModal,
  onCloseModal,
  onConfirm,
  onCancel,
  hasCancelButton = true,
  hasConfirmButton = true,
  confirmButtonClass = 'button--submit',
  cancelButtonClass = 'button--cancel',
  size = 'md',
  animation = true,
  backdrop = true,
  closeButton = false
}) => {
  function handleCloseModal (e) {
    if (typeof onCloseModal === 'function') {
      onCloseModal(e);
    }
  }

  function handleConfirm (e) {
    if (typeof onConfirm === 'function') {
      onConfirm(e);
    }
  }

  function handleCancel (e) {
    if (typeof onCancel === 'function') {
      onCancel(e);
    } else {
      handleCloseModal(e);
    }
  }

  return (
    <Modal
      dialogClassName={`default-modal ${className}`}
      show={showModal}
      onHide={handleCloseModal}
      centered
      size={size}
      aria-labelledby={`modal__${className}`}
      animation={animation}
      backdrop={backdrop}
    >
      <Modal.Header className={`${className}__header`} closeButton={closeButton}></Modal.Header>
      <Modal.Title id={`modal__${className}`} className={`${className}__title`}>
        { title }
      </Modal.Title>
      <Modal.Body>
        { children }
      </Modal.Body>
      {(hasCancelButton || hasConfirmButton) &&
        <Modal.Footer>
          {hasCancelButton && <button
            className={`button ${cancelButtonClass} button__animation--md button__arrow--sm button__animation button--secondary form-group__element--left`}
            onClick={handleCancel}>
            { cancelButtonText }
          </button>}
          {hasConfirmButton && <button
            className={`button ${confirmButtonClass} button__animation--md button__arrow--sm button__animation form-group__element--left`}
            onClick={handleConfirm}>
            { confirmButtonText }
          </button>}
        </Modal.Footer>
      }
    </Modal>
  );
};

DefaultModal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  showModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  hasCancelButton: PropTypes.bool,
  hasConfirmButton: PropTypes.bool,
  confirmButtonClass: PropTypes.string,
  cancelButtonClass: PropTypes.string,
  size: PropTypes.string,
  animation: PropTypes.bool,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  closeButton: PropTypes.bool,
};

export default DefaultModal;
