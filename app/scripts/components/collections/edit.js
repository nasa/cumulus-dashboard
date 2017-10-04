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

const SCHEMA_KEY = 'collection';

var EditCollection = React.createClass({
  propTypes: {
    params: PropTypes.object,
    collections: PropTypes.object,
    router: PropTypes.object
  },

  render: function () {
    const { params, collections } = this.props;
    const { name, version } = params;
    const collectionId = getCollectionId({ name, version });
    return (
      <EditRaw
        pk={collectionId}
        schemaKey={SCHEMA_KEY}
        primaryProperty={'name'}
        state={collections}
        getRecord={() => getCollection(name, version)}
        updateRecord={updateCollection}
        backRoute={`/collections/collection/${name}/${version}`}
        clearRecordUpdate={clearUpdateCollection}
      />
    );
  }
});

export default connect(state => ({
  collections: state.collections
}))(EditCollection);
