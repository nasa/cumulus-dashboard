'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRule } from '../../actions';
import AddRecord from '../app/add';

const SCHEMA_KEY = 'rule';

const AddRule = React.createClass({
  propTypes: {
    rules: PropTypes.object
  },

  render: function () {
    return (
      <AddRecord
        schemaKey={SCHEMA_KEY}
        primaryProperty={'name'}
        title={'Create a rule'}
        state={this.props.rules}
        baseRoute={'/rules/rule'}
        createRecord={createRule}
      />
    );
  }
});

export default connect(state => ({
  rules: state.rules
}))(AddRule);
