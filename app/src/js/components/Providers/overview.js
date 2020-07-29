'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { get } from 'object-path';
import cloneDeep from 'lodash.clonedeep';
import {
  listProviders,
  getCount,
  filterProviders,
  clearProvidersFilter,
} from '../../actions';
import { lastUpdated } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import PropTypes from 'prop-types';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';
import ListFilters from '../ListActions/ListFilters';
import { getPersistentQueryParams } from '../../utils/url-helper';

class ProvidersOverview extends React.Component {
  constructor() {
    super();
    this.queryStats = this.queryStats.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
  }

  componentDidMount() {
    this.queryStats();
  }

  queryStats() {
    this.props.dispatch(
      getCount({
        type: 'collections',
        field: 'providers',
      })
    );
  }

  generateQuery() {
    const { queryParams } = this.props;
    return { ...queryParams };
  }

  render () {
    const { dispatch, providers, stats } = this.props;
    const { list } = providers;
    const { count, queriedAt } = list.meta;

    const bulkActions = [
      {
        Component: <Link
          className="button button--green button--add button--small form-group__element"
          to={location => ({ pathname: '/providers/add', search: getPersistentQueryParams(location) })}
        >
          Add Provider
        </Link>
      }
    ];

    // Incorporate the collection counts into the `list`
    const mutableList = cloneDeep(list);
    const collectionCounts = get(stats.count, 'data.collections.count', []);

    mutableList.data.forEach((d) => {
      d.collections = get(
        collectionCounts.find((c) => c.key === d.name),
        'count',
        0
      );
    });
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
            list={mutableList}
            dispatch={dispatch}
            action={listProviders}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={bulkActions}
            rowId="name"
            sortId="timestamp"
          >
            <ListFilters>
              <Dropdown
                options={pageSizeOptions}
                action={filterProviders}
                clear={clearProvidersFilter}
                paramKey={'limit'}
                label={'Results Per Page'}
                inputProps={{
                  placeholder: 'Results Per Page',
                }}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

ProvidersOverview.propTypes = {
  dispatch: PropTypes.func,
  providers: PropTypes.object,
  queryParams: PropTypes.object,
  stats: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    providers: state.providers,
    stats: state.stats,
  }))(ProvidersOverview)
);
