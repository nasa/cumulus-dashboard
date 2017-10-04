'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { createProvider } from '../../actions';
import AddRecord from '../app/add';

const SCHEMA_KEY = 'provider';

var AddProvider = React.createClass({
  getInitialState: function () {
    return {
      name: null
    };
  },

  propTypes: {
    providers: React.PropTypes.object
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
