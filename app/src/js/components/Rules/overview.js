import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  allRules,
  searchRules,
  clearRulesSearch,
  filterRules,
  clearRulesFilter,
} from '../../actions';
import { lastUpdated, tally } from '../../utils/format';
import List from '../Table/Table';
import Search from '../Search/search';
import { tableColumns, bulkActions } from '../../utils/table-config/rules';
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

const RulesOverview = ({ queryParams }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allRules());
  }, [dispatch]);

  const rules = useSelector((state) => state.rules);

  const generateBulkActions = useCallback(() => bulkActions(rules), [rules]);

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
          action={allRules}
          tableColumns={tableColumns}
          query={{ ...queryParams }}
          initialSortId="updatedAt"
          bulkActions={generateBulkActions()}
          rowId="name"
          filterAction={filterRules}
          filterClear={clearRulesFilter}
          tableId="rules"
        >
          <Search
            action={searchRules}
            clear={clearRulesSearch}
            label="Search"
            labelKey="name"
            placeholder="Rule"
            searchKey="rules"
          />
        </List>
      </section>
    </div>
  );
};

RulesOverview.propTypes = {
  queryParams: PropTypes.object,
};

export default withRouter(
  (RulesOverview)
);
