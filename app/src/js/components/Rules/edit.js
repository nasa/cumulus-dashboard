import React from 'react';
import { Helmet } from 'react-helmet';
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

const EditRule = ({
  match,
  rules
}) => {
  const { params: { ruleName } } = match;

  return (
    <div className = "edit_rules">
      <Helmet>
        <title> Edit Rule </title>
      </Helmet>
      <EditRaw
        pk={ruleName}
        schemaKey={SCHEMA_KEY}
        primaryProperty='name'
        state={rules}
        getRecord={() => getRule(ruleName)}
        updateRecord={updateRule}
        backRoute={`/rules/rule/${ruleName}`}
        clearRecordUpdate={clearUpdateRule}
        hasModal={true}
      />
    </div>
  );
};

EditRule.propTypes = {
  match: PropTypes.object,
  rules: PropTypes.object
};

export default withRouter(connect((state) => ({
  rules: state.rules
}))(EditRule));
