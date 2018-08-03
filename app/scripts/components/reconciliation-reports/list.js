'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  listReconciliationReports
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions
} from '../../utils/table-config/reconciliation-reports';
import Search from '../form/search';
import List from '../table/list-view';

const ReconciliationReportList = React.createClass({
  displayName: 'ReconciliationReportList',

  propTypes: {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    reconciliationReports: PropTypes.object
  },

  generateQuery: function () {
    return {};
  },

  generateBulkActions: function () {
    const { reconciliationReports } = this.props;
    return bulkActions(reconciliationReports);
  },

  render: function () {
    const { list } = this.props.reconciliationReports;
    const { queriedAt } = list.meta;

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              Reconciliation Reports Overview
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <div className='filters'>
            <Search dispatch={this.props.dispatch}
              action={searchReconciliationReports}
              clear={clearReconciliationReportSearch}
            />
          </div>

          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listReconciliationReports}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'reconciliationReportName'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList);
