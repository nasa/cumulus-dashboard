'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  listRules,
  enableRule,
  disableRule,
  deleteRule
} from '../../actions';
import {
  lastUpdated,
  tally,
  getCollectionId,
  collectionLink,
  providerLink,
  fromNow
} from '../../utils/format';
import List from '../Table/Table';
import { strings } from '../locale';

const tableHeader = [
  'Name',
  'Provider',
  strings.collection_id,
  'Type',
  'State',
  'Timestamp'
];

const tableRow = [
  (d) => <Link to={`rules/rule/${d.name}`}>{d.name}</Link>,
  (d) => providerLink(d.provider),
  (d) => collectionLink(getCollectionId(d.collection)),
  'rule.type',
  'state',
  (d) => fromNow(d.timestamp)
];

const tableSortProps = [
  'name',
  'provider',
  null,
  null,
  'state',
  'timestamp'
];

const bulkActions = (rules) => [{
  text: 'Enable',
  action: (ruleName) =>
    enableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.enabled,
  confirm: (d) => `Enable ${d} Rule(s)?`
}, {
  text: 'Disable',
  action: (ruleName) =>
    disableRule(rules.list.data.find((rule) => rule.name === ruleName)),
  state: rules.disabled,
  confirm: (d) => `Disable ${d} Rule(s)?`
}, {
  text: 'Delete',
  action: deleteRule,
  state: rules.deleted,
  confirm: (d) => `Delete ${d} Rule(s)?`
}];

class RulesOverview extends React.Component {
  constructor () {
    super();
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount () {
    this.props.dispatch(listRules);
  }

  generateBulkActions () {
    const { rules } = this.props;
    return bulkActions(rules);
  }

  render () {
    const { list } = this.props.rules;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>Rule Overview</h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>All Rules <span className='num--title'>{count ? ` ${tally(count)}` : null}</span></h2>
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listRules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={{}}
            sortIdx={5}
            bulkActions={this.generateBulkActions()}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
}

RulesOverview.propTypes = {
  dispatch: PropTypes.func,
  rules: PropTypes.object
};

export default connect(state => ({
  rules: state.rules
}))(RulesOverview);
