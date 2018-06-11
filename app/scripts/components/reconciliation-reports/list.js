'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  listReconciliationReports
} from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  errorTableHeader,
  errorTableRow,
  errorTableSortProps,
  bulkActions
} from '../../utils/table-config/pdrs';
import Search from '../form/search';
import List from '../table/list-view';

const ReconciliationReportList = React.createClass({
  displayName: 'Reconciliation Reports',

  propTypes: {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    reconciliationReports: PropTypes.object
  },

  generateBulkActions: function () {
    return bulkActions(this.props.reconciliationReports);
  },

  render: function () {
    const { list } = this.props.reconciliationReports;
    const { count, queriedAt } = list.meta;
    const view = this.getView();
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>{displayCase(view)} PDRs
              <span className='num--title'>{!isNaN(count) ? `(${tally(count)})` : null}</span></h1>
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
            tableHeader={view === 'failed' ? errorTableHeader : tableHeader}
            tableRow={view === 'failed' ? errorTableRow : tableRow}
            tableSortProps={view === 'failed' ? errorTableSortProps : tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'pdrName'}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList);
