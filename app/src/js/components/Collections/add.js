import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { createCollection, getSchema } from '../../actions';
import { getCollectionId, collectionHrefFromId } from '../../utils/format';
import { removeReadOnly } from '../FormSchema/schema';
import AddRaw from '../AddRaw/add-raw';
// import withRouter from '../../withRouter';

const AddCollection = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const collections = useSelector((state) => state.collections);
  const schema = useSelector((state) => state.schema);

  const [defaultValue, setDefaultValue] = useState({});
  const { state: locationState } = location;
  const { name, version } = locationState || {};
  const collectionId = getCollectionId({ name, version });
  const { collection: collectionSchema } = schema || {};
  const { map: collectionsMap } = collections || {};
  const isCopy = !!(name && version);

  useEffect(() => {
    if (isCopy) {
      dispatch(getSchema('collection'));
    }
  }, [isCopy, dispatch]);

  useEffect(() => {
    const record = collectionsMap[collectionId];
    const { data } = record || {};
    if (isCopy && data && collectionSchema) {
      setDefaultValue(removeReadOnly(data, collectionSchema));
    }
  }, [collectionSchema, collectionId, collectionsMap, isCopy]);

  const getBaseRoute = (pk) => (pk && pk !== 'unknown' ? collectionHrefFromId(pk) : '/collections');
  return (
    <div className = "add_collections">
      <Helmet>
        <title> Add Collection </title>
      </Helmet>
      <AddRaw
        pk={'new-collection'}
        title={'Add a collection'}
        primaryProperty={'name'}
        state={collections}
        createRecord={createCollection}
        getBaseRoute={getBaseRoute}
        getPk={getCollectionId}
        defaultValue={defaultValue}
      />
    </div>
  );
};

AddCollection.propTypes = {
  collections: PropTypes.object,
  schema: PropTypes.object,
};

export default AddCollection;
