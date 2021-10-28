import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getProvider,
  updateProvider,
  clearUpdateProvider
} from '../../actions';
import EditRecord from '../Edit/edit';
import { isValidProvider } from '../../utils/validate';

const SCHEMA_KEY = 'provider';

const EditProvider = ({
  match,
  providers,
}) => {
  const { providerId } = match.params;
  return (
    <div className = "edit_provider">
      <Helmet>
        <title> Edit Provider </title>
      </Helmet>
      <EditRecord
        merge={true}
        pk={providerId}
        schemaKey={SCHEMA_KEY}
        state={providers}
        getRecord={getProvider}
        updateRecord={updateProvider}
        clearRecordUpdate={clearUpdateProvider}
        backRoute={`/providers/provider/${providerId}`}
        validate={isValidProvider}
        validationError={'Concurrent Connection Limit cannot be a negative value'}
      />
    </div>
  );
};

EditProvider.propTypes = {
  match: PropTypes.object,
  providers: PropTypes.object
};

export default withRouter(
  connect((state) => ({
    providers: state.providers
  }))(EditProvider)
);
