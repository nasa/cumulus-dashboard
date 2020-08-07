import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  createRule,
  listWorkflows,
  listProviders,
  listCollections
} from '../../actions';
import AddRecord from '../Add/add';
import { getCollectionId, nullValue, collectionNameVersion } from '../../utils/format';

/**
 * Converts the Collection ID string associated with the `collection` property
 * of the specified Rule to a nested object containing the `name` and `version`
 * of the collection, as required by the API when adding a Rule.
 *
 * For example, converts this entry within the specified Rule object:
 *
 * ```
 * collection: "MOD09GK___006"
 * ```
 *
 * to this:
 *
 * ```
 * collection: {
 *   name: "MOD09GK",
 *   version: "006"
 * }
 * ```
 *
 * This conversion is necessary because the "Add Rule" form captures the
 * Collection ID as a string in a single field, rather than capturing the
 * collection's name and version in separate fields, which is neither
 * user-friendly nor convenient to code.  While this is still not necessary
 * convenient either, it is _less_ inconvenient.
 *
 * @param {object} rule - Rule object to validate prior to creation
 * @returns `true` to indicate that the specified Rule is valid (although this
 *    function does not perform any validation)
 */
const validate = (rule) => {
  const ruleCollection = collectionNameVersion(rule.collection);
  if (ruleCollection !== nullValue) {
    rule.collection = ruleCollection;
  }
  return true;
};

/**
 * Returns a number indicating the relative lexicographical, case-insensitive
 * ordering of the specified strings.  Returns a number less than 0 if the
 * first string occurs before the second string in ascending lexiographical
 * (and case-insensitive) order; 0 if they are equivalent; greater than zero if
 * the first occurs after the second.
 *
 * @param {string} a - first string to compare
 * @param {string} b - second string to compare
 * @param {number} a number less than 0 if `a` is "less than" `b`, 0 if they
 *    are "equal" (ignoring case), or a number greater than 0 if `a` is
 *    "greater than" `b`
 */
const asc = (a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' });

const initialRule = {
  name: '',
  workflow: '',
  provider: '',
  collection: '',
  meta: {},
  rule: {
    type: '',
    value: ''
  },
  state: ''
};

const AddRule = ({
  dispatch,
  rules,
  collections,
  providers,
  workflows,
  location = {}
}) => {
  const [rule, setRule] = useState(initialRule);
  const { state: locationState } = location;
  const { name } = locationState || {};
  const { map: rulesMap } = rules || {};
  const isCopy = name !== undefined;
  const title = isCopy ? 'Copy a rule' : 'Add a rule';
  const [enums, setEnums] = useState({
    collection: [],
    provider: [],
    workflow: []
  });

  useEffect(() => {
    const { data } = rulesMap[name] || {};

    if (isCopy && data) {
      // Set the rule to the entry in the rules map associated with the rule's
      // name, but first replace the collection name/version object with the
      // collection's ID (string) since the "Add/Copy Rule" form displays the
      // colleciton ID's in a dropdown.
      setRule({ ...data, collection: getCollectionId(data.collection) });
    }
  }, [name, rulesMap, isCopy]);

  useEffect(() => {
    dispatch(listCollections({ listAll: true, getMMT: false }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(listProviders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listWorkflows());
  }, [dispatch]);

  useEffect(() => {
    setEnums({
      collection: collections.list.data.map(getCollectionId).sort(asc),
      provider: providers.list.data.map(({ id }) => id).sort(asc),
      workflow: workflows.list.data.map(({ name: workflowName }) => workflowName).sort(asc)
    });
  }, [collections, providers, workflows]);

  return (
    <div className = "add_rules">
      <Helmet>
        <title> Add Rule </title>
      </Helmet>
      <AddRecord
        data={rule}
        schemaKey={'rule'}
        primaryProperty={'name'}
        title={title}
        state={rules}
        baseRoute={'/rules/rule'}
        createRecord={createRule}
        exclude={['updatedAt']}
        enums={enums}
        validate={validate}
      />
    </div>
  );
};

AddRule.propTypes = {
  collections: PropTypes.object,
  dispatch: PropTypes.func,
  location: PropTypes.object,
  providers: PropTypes.object,
  rules: PropTypes.object,
  workflows: PropTypes.object
};

export default withRouter(
  connect((state) => ({
    collections: state.collections,
    providers: state.providers,
    rules: state.rules,
    workflows: state.workflows
  }))(AddRule)
);
