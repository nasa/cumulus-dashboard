'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getProvider,
  updateProvider,
  clearUpdateProvider
} from '../../actions';
import EditRecord from '../app/edit';

const SCHEMA_KEY = 'provider';

var EditProvider = createReactClass({
  propTypes: {
    params: PropTypes.object,
    providers: PropTypes.object
  },

  render: function () {
    const { providerId } = this.props.params;
    return (
      <EditRecord
        pk={providerId}
        schemaKey={SCHEMA_KEY}
        state={this.props.providers}
        getRecord={getProvider}
        updateRecord={updateProvider}
        clearRecordUpdate={clearUpdateProvider}
        backRoute={`providers/provider/${providerId}`}
      />
    );
  }
});

export default connect(state => ({
  providers: state.providers
}))(EditProvider);
