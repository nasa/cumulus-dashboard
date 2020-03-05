'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  listReconciliationReports
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns, bulkActions } from '../../utils/table-config/reconciliation-reports';
import Search from '../Search/search';
import List from '../Table/Table';

class ReconciliationReportList extends React.Component {
  constructor () {
    super();
    this.displayName = 'ReconciliationReportList';
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  generateQuery () {
    return {};
  }

  generateBulkActions () {
    const { reconciliationReports } = this.props;
    return bulkActions(reconciliationReports);
  }

  render () {
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
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='reconciliationReportName'
          />
        </section>
      </div>
    );
  }
}

ReconciliationReportList.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  reconciliationReports: PropTypes.object
};

export default withRouter(connect(state => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList));
