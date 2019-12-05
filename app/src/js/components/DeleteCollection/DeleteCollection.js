import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import '../Button/Button.scss';
import DeleteCollectionModal from './DeleteCollectionModal';
import CollectionDeletedConfirmModal from './CollectionDeletedConfirmModal';
import GranulesRedirectModal from './GranulesRedirectModal';

class DeleteCollection extends React.Component {
  constructor () {
    super();

    this.handleDeleteCollection = this.handleDeleteCollection.bind(this);
  }
  render () {
    return (
      <div className="DeleteCollection">
        <h1>Future Home For Delecting A Collection</h1>
        { /* Need all components for deleting a Collection brought into here and the behaviors set up for the modal workflow */ }
      </div>
    );
  }
}

export default DeleteCollection;
