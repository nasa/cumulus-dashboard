'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createRule } from '../../actions';
import AddRecord from '../Add/add';

const AddRule = ({ rules, location = {} }) => {
  const { state: locationState } = location;
  const { name } = locationState || {};
  const isCopy = name !== undefined;
  const title = isCopy ? 'Copy a rule' : 'Add a rule';

  return (
    <AddRecord
      schemaKey={'rule'}
      primaryProperty={'name'}
      title={title}
      state={rules}
      baseRoute={'/rules/rule'}
      createRecord={createRule}
      exclude={['updatedAt']}
    />
  );
};

AddRule.propTypes = {
  location: PropTypes.object,
  rules: PropTypes.object
};

export default withRouter(
  connect(state => ({
    rules: state.rules
  }))(AddRule)
);
