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

const ModalBody = ({ isSuccess, isError, error, name, version }) => {
  return (
    <div>
      {`Collection ${name} / ${version} `}
      {(isSuccess && !isError) && 'has been updated'}
      {isError &&
       <>
        {'has encountered an error.'}
        <div className="error">{error}</div>
       </>
      }
    </div>
  );
};

ModalBody.propTypes = {
  isError: PropTypes.bool,
  isSuccess: PropTypes.bool,
  error: PropTypes.string,
  name: PropTypes.string,
  version: PropTypes.string
};

const EditCollection = ({ match, collections }) => {
  const { params: { name, version } } = match;
  const collectionId = getCollectionId({ name, version });

  const wrapModalBody = ModalBody => ({ ...props }) => {
    return (
      <ModalBody name={name} version={version} {...props} />
    );
  };

  const ModalBodyWrapper = wrapModalBody(ModalBody);

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
      hasModal={true}
      type='collection'
      ModalBody={ModalBodyWrapper}
    />
  );
};

EditCollection.propTypes = {
  match: PropTypes.object,
  collections: PropTypes.object
};

export default withRouter(connect(state => ({
  collections: state.collections
}))(EditCollection));
