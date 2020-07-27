import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createProvider } from '../../actions';
import AddRecord from '../Add/add';

const SCHEMA_KEY = 'provider';

class AddProvider extends React.Component {
  constructor () {
    super();
    this.state = { name: null };
  }

  render () {
    return (
      <div className = "add_providers">
        <Helmet>
          <title> Add Provider </title>
        </Helmet>
        <AddRecord
          schemaKey={SCHEMA_KEY}
          primaryProperty={'id'}
          title={'Create a provider'}
          state={this.props.providers}
          baseRoute={'/providers/provider'}
          createRecord={createProvider}
        />
      </div>
    );
  }
}

AddProvider.propTypes = {
  providers: PropTypes.object
};

export default withRouter(
  connect((state) => ({
    providers: state.providers
  }))(AddProvider)
);
