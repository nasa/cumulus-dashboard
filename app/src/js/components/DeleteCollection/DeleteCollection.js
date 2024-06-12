import React from 'react';
import PropTypes from 'prop-types';
import DeleteCollectionModal from './DeleteCollectionModal.js';
import CollectionDeletedConfirmModal from './CollectionDeletedConfirmModal.js';
import CollectionDeletedErrorModal from './CollectionDeletedErrorModal.js';
import GranulesRedirectModal from './GranulesRedirectModal.js';
import { collectionName as collectionLabelForId } from '../../utils/format.js';

class DeleteCollection extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      modal: null
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleGotoGranules = this.handleGotoGranules.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  componentDidUpdate (prevProps) {
    const { status } = this.props;

    if (prevProps.status === 'inflight' && status === 'success') {
      this.handleSuccess();
    } else if (prevProps.status === 'inflight' && status === 'error') {
      this.handleError();
    }
  }

  get modal () {
    return this.state.modal;
  }

  set modal (modal) {
    this.setState({ modal });
  }

  handleClick (e) {
    e.preventDefault();
    this.modal = DeleteCollectionModal;
  }

  handleClose () {
    this.modal = null;

    if (this.props.status === 'success') {
      if (typeof this.props.onSuccess === 'function') this.props.onSuccess();
    } else if (this.props.status === 'error') {
      if (typeof this.props.onError === 'function') this.props.onError();
    }
  }

  handleConfirm () {
    if (this.props.hasGranules) {
      this.modal = GranulesRedirectModal;
    } else {
      this.props.onDelete();
    }
  }

  handleSuccess () {
    this.modal = CollectionDeletedConfirmModal;
  }

  handleError () {
    this.modal = CollectionDeletedErrorModal;
  }

  handleGotoGranules () {
    this.modal = null;
    this.props.onGotoGranules();
  }

  render () {
    const label = collectionLabelForId(this.props.collectionId);

    return (
      <div className="DeleteCollection">
        <button
          className='button button--delete button--small form-group__element'
          onClick={this.handleClick}
        >
          Delete Collection
        </button>

        <DeleteCollectionModal
          collectionLabel={label}
          show={this.modal === DeleteCollectionModal}
          onCancel={this.handleClose}
          onConfirm={this.handleConfirm}
        />
        <CollectionDeletedConfirmModal
          collectionLabel={label}
          show={this.modal === CollectionDeletedConfirmModal}
          onClose={this.handleClose}
        />
        <CollectionDeletedErrorModal
          collectionLabel={label}
          errors={this.props.errors}
          show={this.modal === CollectionDeletedErrorModal}
          onClose={this.handleClose}
        />
        <GranulesRedirectModal
          collectionLabel={label}
          show={this.modal === GranulesRedirectModal}
          onCancel={this.handleClose}
          onConfirm={this.handleGotoGranules}
        />
      </div>
    );
  }
}

DeleteCollection.propTypes = {
  collectionId: PropTypes.string.isRequired,
  errors: PropTypes.array,
  hasGranules: PropTypes.bool,
  status: PropTypes.string,

  onDelete: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onGotoGranules: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
};

export default DeleteCollection;
