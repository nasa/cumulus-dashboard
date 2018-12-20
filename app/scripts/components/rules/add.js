'use strict';
import React from 'react';
import createReactClass from 'create-react-class';
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
const AddRule = createReactClass({
  propTypes: {
    rules: PropTypes.object
  },
  render: function () {
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
});

export default connect(state => ({
  rules: state.rules
}))(AddRule);
