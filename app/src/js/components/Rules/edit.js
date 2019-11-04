'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';

import EditRaw from '../EditRaw/edit-raw';

const SCHEMA_KEY = 'rule';

class EditRule extends React.Component {
  render () {
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
}

EditRule.propTypes = {
  params: PropTypes.object,
  rules: PropTypes.object
};

export default connect(state => ({
  rules: state.rules
}))(EditRule);
