import React from 'react';
import PropTypes from 'prop-types';
import DefaultModal from '../Modal/modal';
// import Modal from '../Modal/modal';

// import Button from '../Button/Button';
import {
  collectionName as collectionLabelForId,
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
      <DefaultModal
        showModal = {this.props.show}
        onCloseModal={this.handleCancel}
        className={'delete-collection-modal'}
        hasCancelButton={true}
        hasConfirmButton={true}
        title='Delete Collection'
        onHide={this.handleCancel}
        aria-labelledby="modal__delete-collection-modal"
        onCancel={this.handleCancel}
        onConfirm={this.handleConfirm}
      >
        <p> You have submitted a request to delete the following collection: </p>
        <br></br>
        <h1>
          <b>{collectionLabelForId(this.props.collectionLabel)}</b>
        </h1>
        <br></br>
        <p> Are you sure you want to permanently delete this collection? </p>
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
