'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createRule } from '../../actions';
import AddRaw from '../AddRaw/add-raw';

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

const ModalBody = ({record}) => {
  const { data } = record;
  const json = JSON.parse(data);
  return (
    <p>Add rule {json.name}</p>
  );
};

ModalBody.propTypes = {
  record: PropTypes.object
};

const AddRule = ({ rules, ...rest }) => {
  return (
    <AddRaw
      pk={'new-rule'}
      title={'Add a rule'}
      primaryProperty={'name'}
      state={rules}
      defaultValue={defaultValue}
      createRecord={createRule}
      getBaseRoute={getBaseRoute}
      getPk={getRuleName}
      requireConfirmation={true}
      type={'rule'}
      ModalBody={ModalBody}
    />
  );
};

AddRule.propTypes = {
  rules: PropTypes.object
};

export default connect(state => ({
  rules: state.rules
}))(AddRule);
