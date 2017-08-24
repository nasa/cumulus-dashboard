'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { tally } from '../../utils/format';
import {
  listWorkflows
} from '../../actions';
import List from '../table/list-view';

const tableHeader = [
  'Name',
  'AWS Link'
];

const tableRow = [
  (d) => <Link to={`/workflows/workflow/${d.name}`}>{d.name}</Link>,
  'definition.Comment'
];

var WorkflowOverview = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    workflows: PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(listWorkflows());
  },

  render: function () {
    const { list } = this.props.workflows;
    const count = list.data.length;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Workflows
            <span className='num--title'>{count ? ` (${tally(count)})` : null}</span>
          </h1>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listWorkflows}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={[]}
            query={{}}
            rowId={'name'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  workflows: state.workflows
}))(WorkflowOverview);
