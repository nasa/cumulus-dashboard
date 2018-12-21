'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { createProvider } from '../../actions';
import AddRecord from '../app/add';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const SCHEMA_KEY = 'provider';

var AddProvider = createReactClass({
  getInitialState: function () {
    return {
      name: null
    };
  },

  propTypes: {
    providers: PropTypes.object
  },

  render: function () {
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
});

export default connect(state => ({
  providers: state.providers
}))(AddProvider);
