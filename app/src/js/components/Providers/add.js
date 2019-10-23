'use strict';
import React from './node_modules/react';
import { connect } from './node_modules/react-redux';
import { createProvider } from '../../actions';
import AddRecord from '../Add/add';
import PropTypes from './node_modules/prop-types';

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

export default connect(state => ({
  providers: state.providers
}))(AddProvider);
