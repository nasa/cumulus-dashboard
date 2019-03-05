'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRule } from '../../actions';
import AddRaw from '../app/add-raw';

const getBaseRoute = function () {
  return '/rules';
};
const getRuleName = function (item) {
  if (item && item.name) {
    return item.name;
  } else {
    return 'unknown';
  }
};
class AddRule extends React.Component {
  render () {
    const defaultValue = {
      name: '',
      workflow: '',
      provider: '',
      collection: {
        name: '',
        version: ''
      },
      meta: {},
      rule: {
        type: '',
        value: ''
      },
      state: 'ENABLED'
    };
    return (
      <AddRaw
        pk={'new-rule'}
        title={'Add a rule'}
        primaryProperty={'name'}
        state={this.props.rules}
        defaultValue={defaultValue}
        createRecord={createRule}
        getBaseRoute={getBaseRoute}
        getPk={getRuleName}
      />
    );
  }
}

AddRule.propTypes = {
  rules: PropTypes.object
};

export default connect(state => ({
  rules: state.rules
}))(AddRule);
