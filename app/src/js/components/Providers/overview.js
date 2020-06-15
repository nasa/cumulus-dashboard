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
  interval,
  filterProviders,
  clearProvidersFilter
} from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import { tableColumns } from '../../utils/table-config/providers';
import List from '../Table/Table';
import PropTypes from 'prop-types';
import Overview from '../Overview/overview';
import _config from '../../config';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';
import ListFilters from '../ListActions/ListFilters';

const { updateInterval } = _config;

class ProvidersOverview extends React.Component {
  constructor () {
    super();
    this.queryStats = this.queryStats.bind(this);
    this.generateQuery = this.generateQuery.bind(this);
    this.renderOverview = this.renderOverview.bind(this);
  }

  componentDidMount () {
    this.cancelInterval = interval(this.queryStats, updateInterval, true);
  }

  componentWillUnmount () {
    if (this.cancelInterval) { this.cancelInterval(); }
  }

  queryStats () {
    this.props.dispatch(getCount({
      type: 'collections',
      field: 'providers'
    }));
    this.props.dispatch(getCount({
      type: 'providers',
      field: 'status'
    }));
  }

  generateQuery () {
    return {};
  }

  renderOverview (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  }

  render () {
    const { list } = this.props.providers;
    const { stats } = this.props;
    const { count, queriedAt } = list.meta;

    // Incorporate the collection counts into the `list`
    const mutableList = cloneDeep(list);
    const collectionCounts = get(stats.count, 'data.collections.count', []);

    mutableList.data.forEach(d => {
      d.collections = get(collectionCounts.find(c => c.key === d.name), 'count', 0);
    });
    const providerStatus = get(stats.count, 'data.providers.count', []);
    const overview = this.renderOverview(providerStatus);
    return (
      <div className='page__component'>
        <Helmet>
          <title> Provider </title>
        </Helmet>
        <section className='page__section page__section__header-wrapper'>
          <h1 className='heading--large heading--shared-content with-description'>Provider Overview</h1>
          {lastUpdated(queriedAt)}
          {overview}
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content'>Ingesting Providers <span className='num-title'>{count ? `${count}` : 0}</span></h2>
          </div>
          <div className='filter__button--add'>
            <Link className='button button--green button--add button--small form-group__element' to='/providers/add'>Add Provider</Link>
          </div>
          <List
            list={mutableList}
            dispatch={this.props.dispatch}
            action={listProviders}
            tableColumns={tableColumns}
            query={this.generateQuery()}
            bulkActions={[]}
            rowId='name'
            sortId='timestamp'
          >
            <ListFilters>
              <Dropdown
                options={pageSizeOptions}
                action={filterProviders}
                clear={clearProvidersFilter}
                paramKey={'limit'}
                label={'Results Per Page'}
                inputProps={{
                  placeholder: 'Results Per Page'
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
  stats: PropTypes.object
};

export default withRouter(connect(state => state)(ProvidersOverview));
