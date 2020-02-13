'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createCollection } from '../../actions';
import { getCollectionId, collectionHref } from '../../utils/format';
import AddRaw from '../AddRaw/add-raw';

const getBaseRoute = function (collectionId) {
  if (collectionId) {
    return collectionHref(collectionId);
  } else {
    return '/collections/all';
  }
};

class AddCollection extends React.Component {
  render () {
    return (
      <AddRaw
        pk={'new-collection'}
        title={'Add a collection'}
        primaryProperty={'name'}
        state={this.props.collections}
        createRecord={createCollection}
        getBaseRoute={getBaseRoute}
        getPk={getCollectionId}
      />
    );
  }
}

AddCollection.propTypes = {
  collections: PropTypes.object
};

export default withRouter(connect(state => ({
  collections: state.collections
}))(AddCollection));
