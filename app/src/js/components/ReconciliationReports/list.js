import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  searchReconciliationReports,
  clearReconciliationReportSearch,
  clearReconciliationReportsFilter,
  listReconciliationReports,
  createReconciliationReport,
  getCount,
  filterReconciliationReports
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { reconciliationReportStatus as statusOptions } from '../../utils/status';
import { reconciliationReportTypes as reportTypeOptions } from '../../utils/type';
import { getPersistentQueryParams } from '../../utils/url-helper';
import { tableColumns, bulkActions } from '../../utils/table-config/reconciliation-reports';
import LoadingEllipsis from '../LoadingEllipsis/loading-ellipsis';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/'
  },
  {
    label: 'Reports',
    active: true
  }
];

class ReconciliationReportList extends React.Component {
  constructor () {
    super();
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
    this.createReport = this.createReport.bind(this);
    this.queryMeta = this.queryMeta.bind(this);
  }

  componentDidMount () {
    this.queryMeta();
  }

  queryMeta () {
    const { dispatch, queryParams } = this.props;
    dispatch(getCount({
      type: 'reconciliationReports',
      field: 'status',
      ...queryParams,
    }));
  }

  generateQuery () {
    const { queryParams } = this.props;
    return { ...queryParams };
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
    const { queriedAt, count } = list.meta;
    const tableColumnsArray = tableColumns({ dispatch: this.props.dispatch });
    return (
      <div className='page__component'>
        <section className='page__section page__section__controls'>
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description'>
              Reconciliation Reports Overview
            </h1>
            <Link
              className='button button--green button--file button--small form-group__element--right'
              to={(location) => ({
                pathname: '/reconciliation-reports/create',
                search: getPersistentQueryParams(location),
              })}
            >
              {reconciliationReports.createReportInflight ? <LoadingEllipsis /> : 'Create New Report'}
            </Link>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>All Reports <span className='num-title'>{count ? `${count}` : 0}</span></h2>
          </div>
        </section>
        <section className='page__section'>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listReconciliationReports}
            tableColumns={tableColumnsArray}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId='name'
            sortId='createdAt'
            filterAction={filterReconciliationReports}
            filterClear={clearReconciliationReportsFilter}
          >
            <ListFilters>
              <Search
                action={searchReconciliationReports}
                clear={clearReconciliationReportSearch}
                inputProps={{
                  className: 'search search--medium',
                }}
                label="Search"
                labelKey="name"
                placeholder="Report Name"
                searchKey="reconciliationReports"
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
          </List>
        </section>
      </div>
    );
  }
}

ReconciliationReportList.propTypes = {
  dispatch: PropTypes.func,
  queryParams: PropTypes.object,
  reconciliationReports: PropTypes.object,
};

export default withRouter(connect((state) => ({
  reconciliationReports: state.reconciliationReports
}))(ReconciliationReportList));
