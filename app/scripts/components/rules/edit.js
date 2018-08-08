'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';

import EditRaw from '../app/edit-raw';

const SCHEMA_KEY = 'rule';

const EditRule = React.createClass({
  propTypes: {
    params: PropTypes.object,
    rules: PropTypes.object
  },

  render: function () {
    const { ruleName } = this.props.params;
    return (
      <EditRaw
        pk={ruleName}
        schemaKey={SCHEMA_KEY}
        primaryProperty={'name'}
        state={this.props.rules}
        getRecord={getRule}
        updateRecord={updateRule}
        backRoute={`rules/rule/${ruleName}`}
        clearRecordUpdate={clearUpdateRule}
      />
    );
  }
});

export default connect(state => ({
  rules: state.rules
}))(EditRule);
