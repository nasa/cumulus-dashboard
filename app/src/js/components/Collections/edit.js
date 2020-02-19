'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getCollection,
  updateCollection,
  clearUpdateCollection
} from '../../actions';
import { getCollectionId } from '../../utils/format';
import EditRaw from '../EditRaw/edit-raw';

const SCHEMA_KEY = 'collection';

class EditCollection extends React.Component {
  render () {
    const { match: { params: { name, version } }, collections } = this.props;
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
}

EditCollection.propTypes = {
  match: PropTypes.object,
  collections: PropTypes.object,
  router: PropTypes.object
};

export default withRouter(connect(state => ({
  collections: state.collections
}))(EditCollection));
