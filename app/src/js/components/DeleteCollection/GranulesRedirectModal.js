import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button/Button';
import '../Button/Button.scss';

class GranulesRedirectModal extends React.Component {
  render () {
    return (
      <Modal
        dialogClassName="granules-redirect-modal"
        show
        centered
        size="md"
        aria-labelledby="modal__granules-redirect-modal"
        >
        <Modal.Header className="granules-redirect-modal__header" closeButton></Modal.Header>
        <Modal.Title id="modal__granules-redirect-modal" className="granules-redirect-modal__title">Delete Collection</Modal.Title>
        <Modal.Body>
          <p>
          You have submitted a request to delete collection {(`${collectionName} ${collectionVersion}`)}. In order to complete your request, the granules associated with this collection needs to be deleted first. Would you like to be redirected to the Granules page?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='button button--cancel button__animation--md button__arrow button__arrow--md button__animation button--secondary form-group__element--left button__cancel'
            onClick={this.cancel}>
              Cancel Request
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

GranulesRedirectModal.propTypes = {
};

export default GranulesRedirectModal;
