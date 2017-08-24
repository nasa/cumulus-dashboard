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
  fullDate
} from '../../utils/format';
import List from '../table/list-view';

const tableHeader = [
  'Name',
  'Provider',
  'Collection',
  'Type',
  'State',
  'Timestamp'
];

const tableRow = [
  'name',
  (d) => <Link to={`providers/provider/${d.provider}`}>{d.provider}</Link>,
  (d) => {
    const { name, version } = d.collection;
    const collectionId = getCollectionId(name, version);
    return <Link to={`collections/collection/${name}/${version}`}>{collectionId}</Link>;
  },
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
