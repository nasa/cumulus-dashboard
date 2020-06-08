'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  clearReconciliationReportsFilter,
  listReconciliationReports,
  createReconciliationReport,
  interval,
  getCount,
  filterReconciliationReports
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { reconciliationReportStatus as statusOptions } from '../../utils/status';
import { reconciliationReportTypes as reportTypeOptions } from '../../utils/report-type';
import { tableColumns, bulkActions } from '../../utils/table-config/reconciliation-reports';
import LoadingEllipsis from '../../components/LoadingEllipsis/loading-ellipsis';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import _config from '../../config';

const { updateInterval } = _config;

class ReconciliationReportList extends React.Component {
  constructor () {
    super();
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.createReport = this.createReport.bind(this);
    this.queryParams = this.queryParams.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(() => this.queryParams(), updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryParams () {
    this.props.dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status'
    }));
  }

  generateQuery () {
    return {};
  }

  generateBulkActions () {
    const { reconciliationReports } = this.props;
    return bulkActions(reconciliationReports);
  }

  createReport () {
    this.props.dispatch(createReconciliationReport());
  }

  render () {
    const { reconciliationReports } = this.props;
    const { list } = this.props.reconciliationReports;
    const { queriedAt } = list.meta;
    const tableColumnsArray = tableColumns({ dispatch: this.props.dispatch });

    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              Reconciliation Reports Overview
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listReconciliationReports}
            tableColumns={tableColumnsArray}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='name'
            sortId='createdAt'
          >
            <ListFilters>
              <Search
                dispatch={this.props.dispatch}
                action={searchReconciliationReports}
                clear={clearReconciliationReportSearch}
                label="Search"
                placeholder="Report Name"
              />
              <Dropdown
                options={reportTypeOptions}
                action={filterReconciliationReports}
                clear={clearReconciliationReportsFilter}
                paramKey="type"
                label="Report Type"
                inputProps={{
                  placeholder: 'All',
                }}
              />
              <Dropdown
                options={statusOptions}
                action={filterReconciliationReports}
                clear={clearReconciliationReportsFilter}
                paramKey="status"
                label="Status"
                inputProps={{
                  placeholder: 'All',
                }}
              />
            </ListFilters>
            <div className='filter__button--add'>
              <button className='button button--green button--add button--small form-group__element' onClick={this.createReport}>
                {reconciliationReports.createReportInflight ? <LoadingEllipsis /> : 'Create Report'}
              </button>
            </div>
          </List>
        </section>
      </div>
    );
  }
}

ReconciliationReportList.propTypes = {
  dispatch: PropTypes.func,
  reconciliationReports: PropTypes.object
};

export default withRouter(connect(state => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList));
