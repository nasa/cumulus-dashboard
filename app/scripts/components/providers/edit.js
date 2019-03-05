'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getProvider,
  updateProvider,
  clearUpdateProvider
} from '../../actions';
import EditRecord from '../app/edit';

const SCHEMA_KEY = 'provider';

class EditProvider extends React.Component {
  render () {
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
}

EditProvider.propTypes = {
  params: PropTypes.object,
  providers: PropTypes.object
};

export default connect(state => ({
  providers: state.providers
}))(EditProvider);
