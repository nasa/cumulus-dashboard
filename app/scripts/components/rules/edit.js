'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';

import EditRaw from '../app/edit-raw';

const SCHEMA_KEY = 'rule';

const EditRule = createReactClass({
  propTypes: {
    params: PropTypes.object,
    rules: PropTypes.object
  },

  render: function () {
    const { params, rules } = this.props;
    const { ruleName } = params;
    return (
      <EditRaw
        pk={ruleName}
        schemaKey={SCHEMA_KEY}
        primaryProperty={'name'}
        state={rules}
        getRecord={() => getRule(ruleName)}
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
