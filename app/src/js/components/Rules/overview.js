'use strict';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  listRules,
  searchRules,
  clearRulesSearch,
  filterRules,
  clearRulesFilter,
} from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import List from '../Table/Table';
import Search from '../Search/search';
import ListFilters from '../ListActions/ListFilters';
import { tableColumns, bulkActions } from '../../utils/table-config/rules';
import Dropdown from '../DropDown/dropdown';
import pageSizeOptions from '../../utils/page-size';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const breadcrumbConfig = [
  {
    label: 'Dashboard Home',
    href: '/',
  },
  {
    label: 'Rules',
    active: true,
  },
];

class RulesOverview extends React.Component {
  constructor() {
    super();
    this.generateBulkActions = this.generateBulkActions.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(listRules);
  }

  generateBulkActions() {
    const { rules } = this.props;
    return bulkActions(rules);
  }

  render() {
    const { dispatch, queryParams, rules } = this.props;
    const { list } = rules;
    const { count, queriedAt } = list.meta;
    return (
      <div className="page__component">
        <Helmet>
          <title> Rules Overview </title>
        </Helmet>
        <section className="page__section page__section__controls">
          <Breadcrumbs config={breadcrumbConfig} />
        </section>
        <section className="page__section page__section__header-wrapper">
          <div className="page__section__header">
            <h1 className="heading--large heading--shared-content with-description">
              Rules Overview
            </h1>
            {lastUpdated(queriedAt)}
          </div>
        </section>
        <section className="page__section">
          <div className="heading__wrapper--border">
            <h2 className="heading--medium heading--shared-content with-description">
              All Rules
              <span className="num-title">
                {count ? ` ${tally(count)}` : 0}
              </span>
            </h2>
          </div>

          <List
            list={list}
            dispatch={dispatch}
            action={listRules}
            tableColumns={tableColumns}
            query={{ ...queryParams }}
            sortId="timestamp"
            bulkActions={this.generateBulkActions()}
            rowId="name"
          >
            <ListFilters>
              <Search
                dispatch={dispatch}
                action={searchRules}
                clear={clearRulesSearch}
                placeholder="Search Rules"
                label="Search"
              />

              <Dropdown
                options={pageSizeOptions}
                action={filterRules}
                clear={clearRulesFilter}
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

RulesOverview.propTypes = {
  dispatch: PropTypes.func,
  queryParams: PropTypes.object,
  rules: PropTypes.object,
};

export default withRouter(
  connect((state) => ({
    rules: state.rules,
  }))(RulesOverview)
);
