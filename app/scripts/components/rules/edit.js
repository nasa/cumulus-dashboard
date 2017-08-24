'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'object-path';
import {
  getRule,
  updateRule,
  clearUpdateRule,
  getSchema
} from '../../actions';
import Loading from '../app/loading-indicator';
import Schema from '../form/schema';
import { updateDelay } from '../../config';

const SCHEMA_KEY = 'rule';
const INCLUDED_FORMS = ['rule.value', 'state'];

const EditRule = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    rules: React.PropTypes.object,
    schema: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    router: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      ruleName: null,
      error: null
    };
  },

  get: function (ruleName) {
    const record = this.props.rules.map[ruleName];
    if (!record) {
      this.props.dispatch(getRule(ruleName));
    }
  },

  componentWillMount: function () {
    const { ruleName } = this.props.params;
    if (ruleName) {
      this.get(ruleName);
    }
    this.props.dispatch(getSchema(SCHEMA_KEY));
  },

  componentWillReceiveProps: function (newProps) {
    const { ruleName } = this.props.params;
    const { updated } = this.props.rules;
    const updateStatus = get(updated, [ruleName, 'status']);
    if (updateStatus === 'success') {
      return setTimeout(() => {
        this.props.dispatch(clearUpdateRule(ruleName));
        this.props.router.push(`/rules/rule/${ruleName}`);
      }, updateDelay);
    } else if (this.state.ruleName === ruleName) { return; }

    const record = get(this.props.rules.map, ruleName, {});

    // record has hit an API error
    if (record.error) {
      this.setState({
        ruleName,
        error: record.error
      });
    } else if (record.data) {
      // record has hit an API success; update the UI
      this.setState({
        ruleName,
        error: null
      });
    } else if (!record.inflight) {
      // we've not yet fetched the record, request it
      this.get(ruleName);
    }
  },

  onSubmit: function (id, payload) {
    const { ruleName } = this.props.params;
    this.setState({ error: null });
    this.props.dispatch(updateRule(ruleName, payload));
  },

  render: function () {
    const { ruleName } = this.props.params;
    const { map, updated } = this.props.rules;
    const record = get(map, ruleName, {});
    const meta = get(updated, ruleName, {});
    const error = this.state.error || record.error || meta.error;
    const schema = this.props.schema[SCHEMA_KEY];
    return (
      <div className='page__component'>
        <section className='page__section'>
          <h1 className='heading--large'>Edit {ruleName}</h1>
          {schema && record.data ? (
            <Schema
              schema={schema}
              data={record.data}
              pk={ruleName}
              onSubmit={this.onSubmit}
              router={this.props.router}
              status={meta.status}
              error={meta.status === 'inflight' ? null : error}
              include={INCLUDED_FORMS}
            />
          ) : <Loading /> }
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  rules: state.rules,
  schema: state.schema
}))(EditRule);
