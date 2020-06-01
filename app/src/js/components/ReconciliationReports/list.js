'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  listReconciliationReports,
  createReconciliationReport,
  getReconciliationReport,
  interval,
  getCount
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns, bulkActions } from '../../utils/table-config/reconciliation-reports';
import LoadingEllipsis from '../../components/LoadingEllipsis/loading-ellipsis';
import Search from '../Search/search';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import withQueryParams from 'react-router-query-params';
import _config from '../../config';

const { updateInterval } = _config;

class ReconciliationReportList extends React.Component {
  constructor () {
    super();
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.createReport = this.createReport.bind(this);
    this.queryParams = this.queryParams.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
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

  handleDownloadClick (e, reportName) {
    e.preventDefault();
    this.props.dispatch(getReconciliationReport(reportName)).then(response => {
      const { data } = response;
      const jsonHref = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;

      const link = document.createElement('a');
      link.setAttribute('download', `${reportName}.json`);
      link.href = jsonHref;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  }

  render () {
    const { reconciliationReports } = this.props;
    const { list } = this.props.reconciliationReports;
    const { queriedAt } = list.meta;

    const downloadColumn = {
      Header: 'Download Report',
      id: 'download',
      accessor: 'name',
      Cell: ({ cell: { value } }) => {
        return (
          <button className='button button__row button__row--download' onClick={e => this.handleDownloadClick(e, value)} />
        );
      },
      disableSortBy: true
    };

    tableColumns.splice(4, 0, downloadColumn);

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
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='name'
            sortId='createdAt'
          >
            <ListFilters>
              <Search dispatch={this.props.dispatch}
                action={searchReconciliationReports}
                clear={clearReconciliationReportSearch}
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

export default withRouter(withQueryParams()(connect(state => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList)));
