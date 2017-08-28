'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createCollection } from '../../actions';
import { getCollectionId, collectionHref } from '../../utils/format';
import AddRaw from '../app/add-raw';

var AddCollection = React.createClass({
  propTypes: {
    collections: PropTypes.object
  },

  render: function () {
    return (
      <AddRaw
        pk={'new-collection'}
        title={'Add a collection'}
        primaryProperty={'name'}
        state={this.props.collections}
        createRecord={createCollection}
        getBaseRoute={collectionHref}
        getPk={getCollectionId}
      />
    );
  }
});

export default connect(state => ({
  collections: state.collections
}))(AddCollection);
