'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  interval,
  getCount,
  searchGranules,
  clearGranulesSearch,
  filterGranules,
  clearGranulesFilter,
  listGranules,
  getOptionsCollectionName
} from '../../actions';
import { get } from 'object-path';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableHeader,
  tableRow,
  tableSortProps,
  bulkActions
} from '../../utils/table-config/granules';
import List from '../table/list-view';
import Dropdown from '../form/dropdown';
import Search from '../form/search';
import Overview from '../app/overview';
import statusOptions from '../../utils/status';
import { updateInterval } from '../../config';
import { strings } from '../locale';

var GranulesOverview = React.createClass({
  propTypes: {
    granules: PropTypes.object,
    stats: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object
  },

  componentWillMount: function () {
    this.cancelInterval = interval(this.queryStats, updateInterval, true);
  },

  componentWillUnmount: function () {
    if (this.cancelInterval) { this.cancelInterval(); }
  },

  queryStats: function () {
    this.props.dispatch(getCount({
      type: 'granules',
      field: 'status'
    }));
  },

  generateQuery: function () {
    return {};
  },

  generateBulkActions: function () {
    const { granules } = this.props;
    return bulkActions(granules);
  },

  renderOverview: function (count) {
    const overview = count.map(d => [tally(d.count), displayCase(d.key)]);
    return <Overview items={overview} inflight={false} />;
  },

  render: function () {
    const { stats, granules } = this.props;
    const { list, dropdowns } = granules;
    const { count, queriedAt } = list.meta;
    return (
      <div className='page__component'>
        <section className='page__section page__section__header-wrapper'>
          <div className='page__section__header'>
            <h1 className='heading--large heading--shared-content with-description '>{strings.granule_overview}</h1>
            {lastUpdated(queriedAt)}
            {this.renderOverview(get(stats, 'count.data.granules.count', []))}
          </div>
        </section>
        <section className='page__section'>
          <div className='heading__wrapper--border'>
            <h2 className='heading--medium heading--shared-content with-description'>{strings.granules} <span className='num--title'>{count ? ` (${tally(count)})` : null}</span></h2>
          </div>
          <div className='filters filters__wlabels'>
            <Dropdown
              getOptions={getOptionsCollectionName}
              options={get(dropdowns, ['collectionName', 'options'])}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'collectionId'}
              label={strings.collection}
            />
            <Dropdown
              options={statusOptions}
              action={filterGranules}
              clear={clearGranulesFilter}
              paramKey={'status'}
              label={'Status'}
            />
            <Search dispatch={this.props.dispatch}
              action={searchGranules}
              clear={clearGranulesSearch}
            />
          </div>

          <List
            list={list}
            action={listGranules}
            tableHeader={tableHeader}
            tableRow={tableRow}
            tableSortProps={tableSortProps}
            query={this.generateQuery()}
            bulkActions={this.generateBulkActions()}
            rowId={'granuleId'}
            sortIdx={6}
          />
        </section>
      </div>
    );
  }
});

export default connect(state => ({
  stats: state.stats,
  granules: state.granules
}))(GranulesOverview);
