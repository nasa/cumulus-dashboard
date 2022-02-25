import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import DefaultModal from '../Modal/modal';

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
      <DefaultModal
        showModal = {this.props.show}
        onCloseModal={this.handleCancel}
        className={'delete-collection-modal'}
        hasCancelButton={false}
        hasConfirmButton={false}
        title='Delete Collection'
        onHide={this.handleCancel}
        aria-labelledby="modal__delete-collection-modal"
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
      >
        <Alert variant="warning"><strong>Warning:</strong> This action can not be reversed once you submit it.</Alert>
        <p> You have submitted a request to delete the following collection: </p>
        <br />
        <h1>
          <strong>{this.props.collectionLabel}</strong>
        </h1>
        <br />
        <p> Are you sure you want to permanently delete this collection? </p>
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
      </DefaultModal>

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
