'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getCollection,
  updateCollection,
  clearUpdateCollection
} from '../../actions';
import { getCollectionId } from '../../utils/format';
import EditRaw from '../app/edit-raw';

var EditCollection = React.createClass({
  propTypes: {
    params: PropTypes.object,
    collections: PropTypes.object,
    router: PropTypes.object
  },

  render: function () {
    const { params, collections } = this.props;
    const { collectionName, collectionVersion } = params;
    const collectionId = getCollectionId({name: collectionName, version: collectionVersion});
    return (
      <EditRaw
        pk={collectionId}
        primaryProperty={'name'}
        state={collections}
        getRecord={() => getCollection(collectionName, collectionVersion)}
        updateRecord={updateCollection}
        backRoute={`/collections/collection/${collectionName}/${collectionVersion}`}
        clearRecordUpdate={clearUpdateCollection}
      />
    );
  }
});

export default connect(state => ({
  collections: state.collections
}))(EditCollection);
