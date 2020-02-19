'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createProvider } from '../../actions';
import AddRecord from '../Add/add';
import PropTypes from 'prop-types';

const SCHEMA_KEY = 'provider';

class AddProvider extends React.Component {
  constructor () {
    super();
    this.state = { name: null };
  }

  render () {
    return (
      <AddRecord
        schemaKey={SCHEMA_KEY}
        primaryProperty={'id'}
        title={'Create a provider'}
        state={this.props.providers}
        baseRoute={'/providers/provider'}
        createRecord={createProvider}
      />
    );
  }
}

AddProvider.propTypes = {
  providers: PropTypes.object
};

export default withRouter(connect(state => ({
  providers: state.providers
}))(AddProvider));
