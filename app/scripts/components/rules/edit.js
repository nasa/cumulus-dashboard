'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getRule,
  updateRule,
  clearUpdateRule
} from '../../actions';
import EditRecord from '../app/edit';

import EditRaw from '../app/edit-raw';  // PGC

const SCHEMA_KEY = 'rule';
const INCLUDED_FORMS = ['rule.value', 'state'];

const EditRule = React.createClass({
  propTypes: {
    params: PropTypes.object,
    rules: PropTypes.object
  },

  render: function () {
    const { ruleName } = this.props.params;
    // return (
    //   <EditRecord
    //     pk={ruleName}
    //     schemaKey={SCHEMA_KEY}
    //     state={this.props.rules}
    //     getRecord={getRule}
    //     updateRecord={updateRule}
    //     clearRecordUpdate={clearUpdateRule}
    //     includedForms={INCLUDED_FORMS}
    //     backRoute={`rules/rule/${ruleName}`}
    //   />
    // );
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
