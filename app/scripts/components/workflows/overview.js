'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  listWorkflows
} from '../../actions';
import List from '../table/list-view';

const tableHeader = [
  'Name',
  'AWS Link'
];

const tableRow = [
  'name',
  (d) => <a href={d.template}>{d.template}</a>
];

var WorkflowOverview = React.createClass({
  propTypes: {
    dispatch: PropTypes.func,
    workflows: PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(listWorkflows({}));
  },

  render: function () {
    const { list } = this.props.workflows;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Workflows Overview</h1>

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
