import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { listPdrs, getCount, clearPdrsFilter, filterPdrs, refreshCumulusDbConnection } from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import { bulkActions } from '../../utils/table-config/pdrs';
import { tableColumns } from '../../utils/table-config/pdr-progress';
import List from '../Table/Table';
import Overview from '../Overview/overview';
import Dropdown from '../DropDown/dropdown';
import statusOptions from '../../utils/status';
import ListFilters from '../ListActions/ListFilters';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import { getPersistentQueryParams } from '../../utils/url-helper';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'PDRs',
    active: true,
  },
];

class PdrOverview extends React.Component {
  constructor() {
    super();
    this.queryStats = this.queryStats.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(refreshCumulusDbConnection());
    this.queryStats();
  }

  queryStats() {
    const { dispatch, queryParams } = this.props;
    dispatch(
      getCount({
        type: 'pdrs',
        field: 'status',
        ...queryParams,
      })
    );
  }

  generateQuery() {
    const { queryParams } = this.props;
    return { ...queryParams };
  }

  generateBulkActions() {
    return bulkActions(this.props.pdrs);
  }

  render() {
    const { pdrs } = this.props;
    const { list } = pdrs;
    const { count, queriedAt } = list.meta;
    // create the overview boxes
    return (
      <div className="page__component">
        <Helmet>
          <title> Cumulus PDRs </title>
        </Helmet>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className="page__section page__section__header-wrapper">
          <h1 className="heading--large heading--shared-content with-description">
            PDR Overview
          </h1>
          {lastUpdated(queriedAt)}
          <Overview type="pdrs" inflight={pdrs.list.inflight} />
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              All PDRs
              <span className="num-title">
                {count ? ` ${tally(count)}` : 0}
              </span>
            </h2>
          </div>
          <List
            list={list}
            action={listPdrs}
            tableColumns={tableColumns}
            initialSortId="timestamp"
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId="pdrName"
            filterAction={filterPdrs}
            filterClear={clearPdrsFilter}
            tableId="pdrs-overview"
          >
            <ListFilters>
              <Dropdown
                options={statusOptions}
                action={filterPdrs}
                clear={clearPdrsFilter}
                paramKey="status"
                label="Status"
              />
            </ListFilters>
          </List>
          <Link
            className="link--secondary link--learn-more"
            to={(location) => ({
              pathname: '/pdrs/active',
              search: getPersistentQueryParams(location),
            })}
          >
            View Currently Active PDRs
          </Link>
        </section>
      </div>
    );
  }
}

PdrOverview.propTypes = {
  dispatch: PropTypes.func,
  pdrs: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    pdrs: state.pdrs,
  }))(PdrOverview)
);
