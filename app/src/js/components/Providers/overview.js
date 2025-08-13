import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  listProviders,
  filterProviders,
  clearProvidersFilter,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import { getPersistentQueryParams } from '../../utils/url-helper';

class ProvidersOverview extends React.Component {
  constructor() {
    super();
    this.generateQuery = this.generateQuery.bind(this);
  }

  generateQuery() {
    const { queryParams } = this.props;
    return { ...queryParams };
  }

  render() {
    const { providers } = this.props;
    const { list } = providers;
    const { count, queriedAt } = list.meta;

    const bulkActions = [
      {
        Component: (
          <Link
            className="button button--green button--add button--small form-group__element"
            to={(location) => ({
              pathname: '/providers/add',
              search: getPersistentQueryParams(location),
            })}
          >
            Add Provider
          </Link>
        ),
      },
    ];

    return (
      <div className="page__component">
        <Helmet>
          <title> Provider </title>
        </Helmet>
        <section className="page__section page__section__header-wrapper">
          <h1 className="heading--large heading--shared-content with-description">
            Provider Overview
          </h1>
          {lastUpdated(queriedAt)}
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content">
              Ingesting Providers
              <span className="num-title">{count ? `${count}` : 0}</span>
            </h2>
          </div>
          <List
            list={list}
            action={listProviders}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={bulkActions}
            rowId="name"
            initialSortId="updatedAt"
            filterAction={filterProviders}
            filterClear={clearProvidersFilter}
            tableId="providers"
          ></List>
        </section>
      </div>
    );
  }
}

ProvidersOverview.propTypes = {
  dispatch: PropTypes.func,
  providers: PropTypes.object,
  queryParams: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    providers: state.providers,
  }))(ProvidersOverview)
);
