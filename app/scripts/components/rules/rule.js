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
  lastUpdated
} from '../../utils/format';
import {
  getRule,
  deleteRule
} from '../../actions';
import Loading from '../app/loading-indicator';
import Metadata from '../table/metadata';
import AsyncCommand from '../form/async-command';

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

  deleteRule: function () {
    const { ruleName } = this.props.params;
    this.props.dispatch(deleteRule(ruleName));
  },

  navigateBack: function () {
    this.props.router.push('/rules');
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
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>{ruleName}</h1>
            <AsyncCommand
              action={this.deleteRule}
              success={this.navigateBack}
              status={deleteStatus}
              className={'form-group__element--right'}
              confirmAction={true}
              confirmText={`Are you sure you want to delete ${ruleName}?`}
              text={deleteStatus === 'success' ? 'Deleted!' : 'Delete'} />
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
