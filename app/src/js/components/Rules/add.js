'use strict';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createRule, getSchema } from '../../actions';
import { removeReadOnly } from '../FormSchema/schema';
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

const AddRule = ({ rules, location = {}, dispatch, schema, ...rest }) => {
  const [defaultValue, setDefaultValue] = useState({
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
  });
  const { state: locationState } = location;
  const { name } = locationState || {};
  const { rule: ruleSchema } = schema || {};
  const { map: rulesMap } = rules || {};
  const isCopy = !!name;
  let title;
  (isCopy) ? title = 'Copy a rule' : title = 'Add a rule';

  useEffect(() => {
    if (isCopy) {
      dispatch(getSchema('rule'));
    }
  }, [isCopy, dispatch]);

  useEffect(() => {
    const record = rulesMap[name];
    const { data } = record || {};
    if (isCopy && data && ruleSchema) {
      setDefaultValue(removeReadOnly(data, ruleSchema));
    }
  }, [ruleSchema, name, rulesMap, isCopy]);

  return (
    <AddRaw
      pk={'new-rule'}
      title={title}
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
  location: PropTypes.object,
  rules: PropTypes.object,
  dispatch: PropTypes.func,
  schema: PropTypes.object,
};

export default withRouter(connect(state => ({
  rules: state.rules,
  schema: state.schema
}))(AddRule));
