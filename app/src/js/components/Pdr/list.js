'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  searchPdrs,
  clearPdrsSearch,
  listPdrs,
  filterPdrs,
  clearPdrsFilter
} from '../../actions';
import { lastUpdated, tally, displayCase } from '../../utils/format';
import {
  tableColumns,
  errorTableColumns,
  bulkActions
} from '../../utils/table-config/pdrs';
import Dropdown from '../DropDown/dropdown';
import Search from '../Search/search';
import List from '../Table/Table';
import { pdrStatus as statusOptions } from '../../utils/status';
import ListFilters from '../ListActions/ListFilters';
import pageSizeOptions from '../../utils/page-size';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

class ActivePdrs extends React.Component {
  constructor () {
    super();
    this.displayName = 'ActivePdrs';
    this.generateQuery = this.generateQuery.bind(this);
    this.getView = this.getView.bind(this);
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  generateQuery () {
    const query = {};
    const { pathname } = this.props.location;
    if (pathname === '/pdrs/completed') query.status = 'completed';
    else if (pathname === '/pdrs/failed') query.status = 'failed';
    else if (pathname === '/pdrs/active') query.status = 'running';
    this.props.onQueryChange(query);
    return query;
  }

  getView () {
    const { pathname } = this.props.location;
    if (pathname === '/pdrs/completed') return 'completed';
    else if (pathname === '/pdrs/failed') return 'failed';
    else if (pathname === '/pdrs/active') return 'active';
    else return 'all';
  }

  generateBulkActions () {
    return bulkActions(this.props.pdrs);
  }

  render () {
    const { list } = this.props.pdrs;
    const { count, queriedAt } = list.meta;
    const query = this.generateQuery();
    const view = this.getView();
    const displayCaseView = displayCase(view);
    const breadcrumbConfig = [
      {
        label: 'Dashboard Home',
        href: '/'
      },
      {
        label: 'PDRs',
        href: '/pdrs'
      },
      {
        label: displayCaseView,
        active: true
      }
    ];
    return (
      <div className='page__component'>
        <section className='page__section'>
          <section className='page__section page__section__controls'>
            <Breadcrumbs config={breadcrumbConfig} />
          </section>
          <div className='page__section__header page__section__header-wrapper'>
            <h1 className='heading--large heading--shared-content with-description'>
              {displayCaseView} PDRs <span className='num--title'>{!isNaN(count) ? `${tally(count)}` : 0}</span>
            </h1>
            {lastUpdated(queriedAt)}
          </div>
          <List
            list={list}
            dispatch={this.props.dispatch}
            action={listPdrs}
            tableColumns={view === 'failed' ? errorTableColumns : tableColumns}
            query={query}
            bulkActions={this.generateBulkActions()}
            rowId='pdrName'
          >
            <ListFilters>
              {view === 'all' ? (
                <Dropdown
                  options={statusOptions}
                  action={filterPdrs}
                  clear={clearPdrsFilter}
                  paramKey={'status'}
                  label={'Status'}
                />
              ) : null}
              <Search dispatch={this.props.dispatch}
                action={searchPdrs}
                clear={clearPdrsSearch}
              />
              <Dropdown
                options={pageSizeOptions}
                action={filterPdrs}
                clear={clearPdrsFilter}
                paramKey={'limit'}
                label={'Results Per Page'}
              />
            </ListFilters>
          </List>
        </section>
      </div>
    );
  }
}

ActivePdrs.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  pdrs: PropTypes.object,
  onQueryChange: PropTypes.func
};

export default withRouter(connect(state => ({
  pdrs: state.pdrs
}))(ActivePdrs));
