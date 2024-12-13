import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import {
  getCollection,
  updateCollection,
  clearUpdateCollection,
} from '../../actions';
import { getCollectionId, collectionHrefFromNameVersion } from '../../utils/format';
import EditRaw from '../EditRaw/edit-raw';
import { withRouter } from '../../withRouter';

const SCHEMA_KEY = 'collection';

const EditCollection = ({ router, collections }) => {
  const {
    params: { name, version },
  } = router || {};

  const decodedVersion = decodeURIComponent(version);
  const collectionId = getCollectionId({ name, version: decodedVersion });

  useEffect(() => {
    if (name && version) {
      getCollection(name, version);
    }
  }, [name, version]);

  return (
    <div className = "edit_collections">
      <Helmet>
        <title>Edit Collection</title>
      </Helmet>
      <EditRaw
        pk={collectionId}
        schemaKey={SCHEMA_KEY}
        primaryProperty="name"
        state={collections}
        getRecord={() => getCollection(name, version)}
        updateRecord={(payload) => updateCollection(payload, name, decodedVersion)}
        backRoute={collectionHrefFromNameVersion({ name, version })}
        clearRecordUpdate={clearUpdateCollection}
        hasModal={true}
      />
    </div>
  );
};

EditCollection.propTypes = {
  collections: PropTypes.object,
  router: PropTypes.shape({
    params: PropTypes.object
  }),
};

const mapStatetoProps = (state) => {
  console.log('Redux State:', state);
  return {
    collections: state.collections
  };
};

export default withRouter(connect(mapStatetoProps)(EditCollection));
