import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createProvider } from '../../actions';
import AddRecord from '../Add/add';
import { isValidProvider } from '../../utils/validate';

const SCHEMA_KEY = 'provider';

const AddProvider = ({ providers }) => (
  <div className="add_providers">
    <Helmet>
      <title> Add Provider </title>
    </Helmet>
    <AddRecord
      baseRoute="/providers/provider"
      createRecord={createProvider}
      primaryProperty="id"
      schemaKey={SCHEMA_KEY}
      state={providers}
      title="Create a provider"
      validate={isValidProvider}
      validationError={'Concurrent Connection Limit cannot be a negative value'}
    />
  </div>
);

AddProvider.propTypes = {
  providers: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    providers: state.providers,
  }))(AddProvider)
);
