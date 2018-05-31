'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRule } from '../../actions';
//PGC import AddRecord from '../app/add';

import AddRaw from '../app/add-raw';  //PGC

//PGC const SCHEMA_KEY = 'rule';

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
const AddRule = React.createClass({
  propTypes: {
    rules: PropTypes.object
  },

  //PGC
  // render: function () {
  //   return (
  //     <AddRecord
  //       schemaKey={SCHEMA_KEY}
  //       primaryProperty={'name'}
  //       title={'Create a rule'}
  //       state={this.props.rules}
  //       baseRoute={'/rules/rule'}
  //       createRecord={createRule}
  //     />
  //   );
  // }
  render: function () {   //PGC
    return (
      <AddRaw
        pk={'new-rule'}
        title={'Add a rule'}
        primaryProperty={'name'}
        state={this.props.rules}
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
