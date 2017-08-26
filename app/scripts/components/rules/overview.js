'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  listRules
} from '../../actions';
import {
  lastUpdated,
  tally,
  getCollectionId,
  collectionLink,
  providerLink,
  fullDate
} from '../../utils/format';
import List from '../table/list-view';

const tableHeader = [
  'Name',
  'Provider',
  'Collection ID',
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
  (d) => fullDate(d.timestamp)
];

const tableSortProps = [
  'name',
  'provider',
  null,
  null,
  'state',
  'timestamp'
];

var WorkflowOverview = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    rules: PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(listRules);
  },

  render: function () {
    const { list } = this.props.rules;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>Workflows Overview <span className='num--title'>{ !isNaN(count) ? `(${tally(count)})` : null }</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listRules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={{}}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  rules: state.rules
}))(WorkflowOverview);
