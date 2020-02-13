'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';

import EditRaw from '../EditRaw/edit-raw';

const SCHEMA_KEY = 'rule';

class EditRule extends React.Component {
  render () {
    const { match: { params: { ruleName } }, rules } = this.props;
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
  match: PropTypes.object,
  rules: PropTypes.object
};

export default withRouter(connect(state => ({
  rules: state.rules
}))(EditRule));
