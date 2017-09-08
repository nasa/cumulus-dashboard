'use strict';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { get } from 'object-path';
import {
  displayCase,
  getCollectionId,
  collectionLink,
  providerLink,
  fullDate,
  lastUpdated,
  deleteText
} from '../../utils/format';
import {
  getRule,
  deleteRule,
  enableRule,
  disableRule
} from '../../actions';
import Loading from '../app/loading-indicator';
import Metadata from '../table/metadata';
import AsyncCommands from '../form/dropdown-async-command';
import ErrorReport from '../errors/report';

const metaAccessors = [
  ['Rule Name', 'name'],
  ['Provider', 'provider', providerLink],
  ['Rule Type', 'rule.type'],
  ['Collection', 'collection', d => collectionLink(getCollectionId(d))],
  ['Timestamp', 'timestamp', fullDate]
];

const Rule = React.createClass({
  propTypes: {
    params: PropTypes.object,
    router: PropTypes.object,
    dispatch: PropTypes.func,
    rules: PropTypes.object
  },

  componentWillMount: function () {
    this.load(this.props.params.ruleName);
  },

  componentWillReceiveProps: function ({ params }) {
    if (params.ruleName !== this.props.params.ruleName) {
      this.load(params.ruleName);
    }
  },

  load: function (ruleName) {
    this.props.dispatch(getRule(ruleName));
  },

  delete: function () {
    const { ruleName } = this.props.params;
    this.props.dispatch(deleteRule(ruleName));
  },

  enable: function () {
    const { ruleName } = this.props.params;
    this.props.dispatch(enableRule(ruleName));
  },

  disable: function () {
    const { ruleName } = this.props.params;
    this.props.dispatch(disableRule(ruleName));
  },

  navigateBack: function () {
    this.props.router.push('/rules');
  },

  reload: function () {
    const { ruleName } = this.props.params;
    this.load(ruleName);
  },

  errors: function () {
    const { ruleName } = this.props.params;
    const { rules } = this.props;
    return [
      get(rules.map, [ruleName, 'error']),
      get(rules.deleted, [ruleName, 'error']),
      get(rules.enabled, [ruleName, 'error']),
      get(rules.disabled, [ruleName, 'error'])
    ].filter(Boolean);
  },

  render: function () {
    const { params, rules } = this.props;
    const { ruleName } = params;
    const record = rules.map[ruleName];

    if (!record || (record.inflight && !record.data)) {
      return <Loading />;
    }
    const data = get(record, 'data', {});

    const deleteStatus = get(rules, `deleted.${ruleName}.status`);
    const enabledStatus = get(rules, `enabled.${ruleName}.status`);
    const disabledStatus = get(rules, `disabled.${ruleName}.status`);
    const dropdownConfig = [{
      text: 'Enable',
      action: this.enable,
      disabled: data.type === 'onetime',
      status: enabledStatus,
      success: this.reload
    }, {
      text: 'Disable',
      action: this.disable,
      disabled: data.type === 'onetime',
      status: disabledStatus,
      success: this.reload
    }, {
      text: 'Delete',
      action: this.delete,
      status: deleteStatus,
      success: this.navigateBack,
      confirmAction: true,
      confirmText: deleteText(ruleName)
    }];

    const errors = this.errors();
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>{ruleName}</h1>
            <AsyncCommands config={dropdownConfig} />

            <Link
              className='button button--small button--green form-group__element--right'
              to={`/rules/edit/${ruleName}`}>Edit</Link>
            {lastUpdated(data.timestamp)}
            {data.state ? (
              <dl className='status--process'>
                <dt>State:</dt>
                <dd className={data.state.toLowerCase()}>{displayCase(data.state)}</dd>
              </dl>
            ) : null}

          </div>
        </section>
        <section className='page__section'>
          {errors.length ? errors.map((error, i) => <ErrorReport key={i} report={error} />) : null}
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium with-description'>Rule Overview</h2>
          </div>
          <Metadata data={data} accessors={metaAccessors} />
        </section>
      </div>
    );
  }
});
export default connect(state => ({
  rules: state.rules
}))(Rule);
